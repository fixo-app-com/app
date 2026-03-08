import { fireEvent, render, screen } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";
import { mockCategories, mockExpenses } from "../../../test/fixtures";
import { mockDataContextDefaults } from "../../../test/mocks";

const mockSetPinnedBudgetMetric = jest.fn();

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

  it("shows set-budget prompt when no budget is set", () => {
    render(<HomeScreen />);
    expect(screen.getByText("home.setMonthlyBudget")).toBeOnTheScreen();
  });

  it("displays hero and secondary metrics when budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 250000 };
    render(<HomeScreen />);
    expect(screen.getByTestId("hero-metric")).toBeOnTheScreen();
    expect(
      screen.getAllByText("home.totalCosts").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("home.leftover").length).toBeGreaterThanOrEqual(
      1,
    );
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

  it("renders budget bar when budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 250000 };
    render(<HomeScreen />);
    expect(screen.getByTestId("budget-bar")).toBeOnTheScreen();
  });

  it("does not render budget bar when no budget is set", () => {
    mockDataOverrides = { monthlyBudgetCents: 0 };
    render(<HomeScreen />);
    expect(screen.queryByTestId("budget-bar")).toBeNull();
  });

  it("renders donut chart when expenses exist", () => {
    render(<HomeScreen />);
    expect(screen.getByTestId("donut-chart")).toBeOnTheScreen();
  });

  it("does not render donut chart when no expenses", () => {
    mockDataOverrides = { expenses: [] };
    render(<HomeScreen />);
    expect(screen.queryByTestId("donut-chart")).toBeNull();
  });

  it("does not render donut chart when categories have no expenses", () => {
    mockDataOverrides = { categories: mockCategories, expenses: [] };
    render(<HomeScreen />);
    expect(screen.queryByTestId("donut-chart")).toBeNull();
  });
});
