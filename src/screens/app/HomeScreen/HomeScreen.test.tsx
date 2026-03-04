import { render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";

// Stable mock references to prevent infinite re-render loops
const mockUser = { uid: "test-uid" };
const mockCategories = [
  { id: "cat1", name: "Subscriptions", icon: "📺", createdAt: new Date() },
  { id: "cat2", name: "Food", icon: "🍔", createdAt: new Date() },
];
const mockExpenses = [
  {
    id: "e1",
    categoryId: "cat1",
    name: "Netflix",
    amountCents: 1299,
    billingFrequency: "monthly",
    walletId: "w1",
    essential: false,
    notes: "",
    createdAt: new Date(),
  },
];

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    addListener: jest.fn(() => jest.fn()),
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    categories: mockCategories,
    currency: "EUR",
    monthlyBudgetCents: 0,
    setMonthlyBudget: jest.fn(),
    viewMode: "monthly",
    setViewMode: jest.fn(),
    isLoading: false,
    expenses: mockExpenses,
    expensesLoading: false,
    ensureExpenses: jest.fn(),
  }),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Home title", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Home")).toBeOnTheScreen();
  });

  it("renders monthly/yearly toggle chips", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Monthly")).toBeOnTheScreen();
    expect(screen.getByText("Yearly")).toBeOnTheScreen();
  });

  it("renders categories", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText("Subscriptions")).toBeOnTheScreen();
      expect(screen.getByText("Food")).toBeOnTheScreen();
    });
  });
});
