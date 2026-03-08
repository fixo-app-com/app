import { fireEvent, render, screen } from "@testing-library/react-native";
import { BudgetCard } from "./BudgetCard";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("BudgetCard", () => {
  const baseProps = {
    hasBudget: true,
    isYearly: false,
    budgetDisplayCents: 250000,
    totalCents: 100000,
    availableCents: 150000,
    pinnedMetric: "budget" as const,
    onPin: jest.fn(),
    onBudgetEdit: jest.fn(),
  };

  it("renders hero metric and secondary metrics when budget is set", () => {
    render(<BudgetCard {...baseProps} />);
    expect(screen.getByTestId("hero-metric")).toBeOnTheScreen();
    expect(screen.getByTestId("secondary-costs")).toBeOnTheScreen();
    expect(screen.getByTestId("secondary-available")).toBeOnTheScreen();
  });

  it("shows set-budget prompt when no budget", () => {
    render(<BudgetCard {...baseProps} hasBudget={false} />);
    expect(screen.getByText("home.setMonthlyBudget")).toBeOnTheScreen();
  });

  it("calls onPin when secondary metric is pressed", () => {
    const onPin = jest.fn();
    render(<BudgetCard {...baseProps} onPin={onPin} />);
    fireEvent.press(screen.getByTestId("secondary-costs"));
    expect(onPin).toHaveBeenCalledWith("costs");
  });

  it("renders budget bar with percentage when budget is set", () => {
    render(<BudgetCard {...baseProps} />);
    expect(screen.getByTestId("budget-bar")).toBeOnTheScreen();
    expect(screen.getByTestId("budget-bar-fill")).toBeOnTheScreen();
    expect(screen.getByText("home.pctUsed")).toBeOnTheScreen();
  });

  it("does not render budget bar when no budget", () => {
    render(<BudgetCard {...baseProps} hasBudget={false} />);
    expect(screen.queryByTestId("budget-bar")).toBeNull();
  });

  it("shows yearly label when isYearly and no budget", () => {
    render(<BudgetCard {...baseProps} hasBudget={false} isYearly={true} />);
    expect(screen.getByText("home.setYearlyBudget")).toBeOnTheScreen();
  });

  it("calls onBudgetEdit when hero budget is pressed", () => {
    const onBudgetEdit = jest.fn();
    render(<BudgetCard {...baseProps} onBudgetEdit={onBudgetEdit} />);
    fireEvent.press(screen.getByTestId("hero-metric"));
    expect(onBudgetEdit).toHaveBeenCalled();
  });
});
