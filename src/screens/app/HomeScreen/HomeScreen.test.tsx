import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
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
const mockSetPinnedBudgetMetric = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    addListener: jest.fn(() => jest.fn()),
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

const mockDataDefaults = {
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
  pinnedBudgetMetric: "budget" as const,
  setPinnedBudgetMetric: mockSetPinnedBudgetMetric,
};

let mockDataOverrides: Partial<typeof mockDataDefaults> = {};

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ ...mockDataDefaults, ...mockDataOverrides }),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDataOverrides = {};
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

  it("shows set-budget prompt when no budget is set", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Set monthly budget")).toBeOnTheScreen();
  });

  it("displays hero and secondary metrics when budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 250000 };
    render(<HomeScreen />);
    expect(screen.getByTestId("hero-metric")).toBeOnTheScreen();
    expect(screen.getAllByText("Total costs").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Leftover").length).toBeGreaterThanOrEqual(1);
  });

  it("tapping secondary metric calls setPinnedBudgetMetric", () => {
    mockDataOverrides = { monthlyBudgetCents: 250000 };
    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId("secondary-costs"));
    expect(mockSetPinnedBudgetMetric).toHaveBeenCalledWith("costs");
  });

  it("pins costs as hero when pinnedBudgetMetric is costs", () => {
    mockDataOverrides = {
      monthlyBudgetCents: 250000,
      pinnedBudgetMetric: "costs",
    };
    render(<HomeScreen />);
    // Costs is now hero, so secondary should show budget and available
    expect(screen.getByTestId("secondary-budget")).toBeOnTheScreen();
    expect(screen.getByTestId("secondary-available")).toBeOnTheScreen();
  });

  it("tapping secondary budget pins it instead of editing", () => {
    mockDataOverrides = {
      monthlyBudgetCents: 250000,
      pinnedBudgetMetric: "costs",
    };
    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId("secondary-budget"));
    expect(mockSetPinnedBudgetMetric).toHaveBeenCalledWith("budget");
  });

  it("renders chart card when budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 250000 };
    render(<HomeScreen />);
    expect(screen.getByTestId("budget-chart-card")).toBeOnTheScreen();
    expect(screen.getByText(/used/)).toBeOnTheScreen();
  });

  it("renders dot indicators when budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 250000 };
    render(<HomeScreen />);
    expect(screen.getByTestId("dot-indicators")).toBeOnTheScreen();
  });

  it("does not render slider or chart when no budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 0 };
    render(<HomeScreen />);
    expect(screen.queryByTestId("budget-slider")).toBeNull();
    expect(screen.queryByTestId("budget-chart-card")).toBeNull();
    expect(screen.queryByTestId("dot-indicators")).toBeNull();
  });
});
