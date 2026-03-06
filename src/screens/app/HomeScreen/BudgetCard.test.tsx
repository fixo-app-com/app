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
});
