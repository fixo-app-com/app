import { render, screen } from "@testing-library/react-native";
import CategoryDetailScreen from "./CategoryDetailScreen";

// Stable mock references
const mockUser = { uid: "test-uid" };
const mockWallets = [
  {
    id: "w1",
    name: "Intesa Sanpaolo",
    icon: "intesa-sanpaolo",
    createdAt: new Date(),
  },
];

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    addListener: jest.fn(() => jest.fn()),
  }),
  useRoute: () => ({
    params: { categoryId: "cat1", categoryName: "Famiglia" },
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    categories: [
      { id: "cat1", name: "Famiglia", icon: "👨‍👩‍👧‍👦", createdAt: new Date() },
    ],
    wallets: mockWallets,
    currency: "EUR",
    viewMode: "monthly",
    deleteCategory: jest.fn(),
    deleteExpense: jest.fn(),
    expenses: [],
    expensesLoading: false,
    ensureExpenses: jest.fn(),
  }),
}));

describe("CategoryDetailScreen", () => {
  it("renders category name in header", () => {
    render(<CategoryDetailScreen />);
    expect(screen.getByText("Famiglia")).toBeOnTheScreen();
  });

  it("renders add expense button", () => {
    render(<CategoryDetailScreen />);
    expect(screen.getByText("categoryDetail.addExpense")).toBeOnTheScreen();
  });
});
