import { fireEvent, render, screen } from "@testing-library/react-native";
import { BudgetCard } from "./BudgetCard";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("BudgetCard", () => {
  const baseProps = {
    hasIncome: true,
    isYearly: false,
    incomeDisplayCents: 250000,
    totalCents: 100000,
    availableCents: 150000,
    pinnedMetric: "income" as const,
    onPin: jest.fn(),
    onIncomeEdit: jest.fn(),
    onMetricInfo: jest.fn(),
  };

  // --- State: Income set (3-metric layout) ---

  it("renders hero metric and 2 secondary metrics when income is set", () => {
    render(<BudgetCard {...baseProps} />);
    expect(screen.getByTestId("hero-metric")).toBeOnTheScreen();
    expect(screen.getByTestId("secondary-costs")).toBeOnTheScreen();
    expect(screen.getByTestId("secondary-available")).toBeOnTheScreen();
  });

  it("calls onPin when secondary metric is pressed", () => {
    const onPin = jest.fn();
    render(<BudgetCard {...baseProps} onPin={onPin} />);
    fireEvent.press(screen.getByTestId("secondary-costs"));
    expect(onPin).toHaveBeenCalledWith("costs");
  });

  it("calls onIncomeEdit when hero is income", () => {
    const onIncomeEdit = jest.fn();
    render(<BudgetCard {...baseProps} onIncomeEdit={onIncomeEdit} />);
    fireEvent.press(screen.getByTestId("hero-metric"));
    expect(onIncomeEdit).toHaveBeenCalled();
  });

  it("does not call edit when hero is costs", () => {
    const onIncomeEdit = jest.fn();
    render(
      <BudgetCard
        {...baseProps}
        pinnedMetric="costs"
        onIncomeEdit={onIncomeEdit}
      />,
    );
    fireEvent.press(screen.getByTestId("hero-metric"));
    expect(onIncomeEdit).not.toHaveBeenCalled();
  });

  // --- State: No income ---

  it("shows set-budget prompt when no income is set", () => {
    render(<BudgetCard {...baseProps} hasIncome={false} />);
    expect(screen.getByTestId("set-budget-prompt")).toBeOnTheScreen();
  });

  it("shows yearly label for prompt when isYearly and no income", () => {
    render(<BudgetCard {...baseProps} hasIncome={false} isYearly={true} />);
    expect(screen.getByText("home.setYearlyIncome")).toBeOnTheScreen();
  });

  it("does not render hero or secondary metrics when no income", () => {
    render(<BudgetCard {...baseProps} hasIncome={false} />);
    expect(screen.queryByTestId("hero-metric")).toBeNull();
    expect(screen.queryByTestId("secondary-costs")).toBeNull();
    expect(screen.queryByTestId("secondary-available")).toBeNull();
  });
});
