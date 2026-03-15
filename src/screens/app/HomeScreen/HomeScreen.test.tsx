import { act, render, screen } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";
import { mockCategories, mockExpenses } from "../../../test/fixtures";
import { mockDataContextDefaults } from "../../../test/mocks";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }),
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
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockDataOverrides = {};
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function renderAndWait() {
    render(<HomeScreen />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
  }

  it("renders Home title", () => {
    renderAndWait();
    expect(screen.getAllByText("home.title").length).toBeGreaterThanOrEqual(1);
  });

  it("renders monthly/yearly toggle chips", () => {
    renderAndWait();
    expect(screen.getByText("common.monthly")).toBeOnTheScreen();
    expect(screen.getByText("common.yearly")).toBeOnTheScreen();
  });

  it("shows set-income prompt when no income is set", () => {
    renderAndWait();
    expect(screen.getByText("home.setMonthlyIncome")).toBeOnTheScreen();
  });

  it("displays hero and secondary metrics when income is set", () => {
    mockDataOverrides = { monthlyIncomeCents: 250000 };
    renderAndWait();
    expect(screen.getByTestId("hero-metric")).toBeOnTheScreen();
    expect(
      screen.getAllByText("home.totalCosts").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("home.available").length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("renders donut chart when expenses exist", () => {
    renderAndWait();
    expect(screen.getByTestId("donut-chart")).toBeOnTheScreen();
  });

  it("does not render donut chart when no expenses", () => {
    mockDataOverrides = { expenses: [] };
    renderAndWait();
    expect(screen.queryByTestId("donut-chart")).toBeNull();
  });

  it("does not render donut chart when categories have no expenses", () => {
    mockDataOverrides = { categories: mockCategories, expenses: [] };
    renderAndWait();
    expect(screen.queryByTestId("donut-chart")).toBeNull();
  });

  it("renders top expenses widget when expenses exist", () => {
    renderAndWait();
    expect(screen.getByTestId("top-expenses")).toBeOnTheScreen();
  });

  it("renders wallet breakdown widget when wallets have spend", () => {
    renderAndWait();
    expect(screen.getByTestId("wallet-breakdown")).toBeOnTheScreen();
  });

  it("renders essential split widget when expenses exist", () => {
    renderAndWait();
    expect(screen.getByTestId("essential-split")).toBeOnTheScreen();
  });
});
