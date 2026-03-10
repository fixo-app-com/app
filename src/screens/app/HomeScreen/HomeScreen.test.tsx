import { render, screen } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";
import { mockCategories, mockExpenses } from "../../../test/fixtures";
import { mockDataContextDefaults } from "../../../test/mocks";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock("./PriorityExpensesSheet", () => ({
  PriorityExpensesSheet: () => null,
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockDataDefaults = {
  ...mockDataContextDefaults,
  categories: mockCategories,
  expenses: mockExpenses,
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
    expect(screen.getAllByText("home.title").length).toBeGreaterThanOrEqual(1);
  });

  it("renders monthly/yearly toggle chips", () => {
    render(<HomeScreen />);
    expect(screen.getByText("common.monthly")).toBeOnTheScreen();
    expect(screen.getByText("common.yearly")).toBeOnTheScreen();
  });

  it("shows set-income prompt when no income is set", () => {
    render(<HomeScreen />);
    expect(screen.getByText("home.setMonthlyIncome")).toBeOnTheScreen();
  });

  it("displays hero and secondary metrics when income is set", () => {
    mockDataOverrides = { monthlyIncomeCents: 250000 };
    render(<HomeScreen />);
    expect(screen.getByTestId("hero-metric")).toBeOnTheScreen();
    expect(
      screen.getAllByText("home.totalCosts").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("home.available").length).toBeGreaterThanOrEqual(
      1,
    );
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

  it("renders top expenses widget when expenses exist", () => {
    render(<HomeScreen />);
    expect(screen.getByTestId("top-expenses")).toBeOnTheScreen();
  });

  it("renders wallet breakdown widget when wallets have spend", () => {
    render(<HomeScreen />);
    expect(screen.getByTestId("wallet-breakdown")).toBeOnTheScreen();
  });

  it("renders essential split widget when expenses exist", () => {
    render(<HomeScreen />);
    expect(screen.getByTestId("essential-split")).toBeOnTheScreen();
  });
});
