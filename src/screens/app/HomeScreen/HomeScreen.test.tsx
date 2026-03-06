import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";
import { mockCategories, mockExpenses } from "../../../test/fixtures";
import { mockCreateNavigation, mockDataContextDefaults } from "../../../test/mocks";

const mockNavigate = jest.fn();
const mockSetPinnedBudgetMetric = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockCreateNavigation({ navigate: mockNavigate }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockDataDefaults = {
  ...mockDataContextDefaults,
  categories: mockCategories,
  expenses: mockExpenses,
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
    expect(screen.getByText("home.title")).toBeOnTheScreen();
  });

  it("renders monthly/yearly toggle chips", () => {
    render(<HomeScreen />);
    expect(screen.getByText("common.monthly")).toBeOnTheScreen();
    expect(screen.getByText("common.yearly")).toBeOnTheScreen();
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
    expect(screen.getByText("home.setMonthlyBudget")).toBeOnTheScreen();
  });

  it("displays hero and secondary metrics when budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 250000 };
    render(<HomeScreen />);
    expect(screen.getByTestId("hero-metric")).toBeOnTheScreen();
    expect(screen.getAllByText("home.totalCosts").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("home.leftover").length).toBeGreaterThanOrEqual(1);
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
    expect(screen.getByText("home.pctUsed")).toBeOnTheScreen();
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
