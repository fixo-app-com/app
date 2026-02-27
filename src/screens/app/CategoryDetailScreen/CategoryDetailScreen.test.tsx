import { render, screen } from "@testing-library/react-native";
import CategoryDetailScreen from "./CategoryDetailScreen";

// Stable mock references
const mockUser = { uid: "test-uid" };
const mockWallets = [
  { id: "w1", name: "Intesa Sanpaolo", createdAt: new Date() },
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
    wallets: mockWallets,
  }),
}));

jest.mock("../../../services/firestore", () => ({
  getExpenses: jest.fn(() => Promise.resolve([])),
  deleteExpense: jest.fn(),
}));

describe("CategoryDetailScreen", () => {
  it("renders category name in header", () => {
    render(<CategoryDetailScreen />);
    expect(screen.getByText("Famiglia")).toBeOnTheScreen();
  });

  it("renders add expense button", () => {
    render(<CategoryDetailScreen />);
    expect(screen.getByText("+ Add expense")).toBeOnTheScreen();
  });

  it("renders category total", () => {
    render(<CategoryDetailScreen />);
    expect(screen.getByText("€0.00")).toBeOnTheScreen();
  });
});
