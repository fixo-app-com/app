import { render, screen } from "@testing-library/react-native";
import { BudgetChartCard } from "./BudgetChartCard";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("BudgetChartCard", () => {
  it("renders chart card with progress bar", () => {
    render(
      <BudgetChartCard
        isYearly={false}
        budgetDisplayCents={250000}
        totalCents={125000}
        availableCents={125000}
      />,
    );
    expect(screen.getByTestId("budget-chart-card")).toBeOnTheScreen();
    expect(screen.getByTestId("budget-bar-fill")).toBeOnTheScreen();
    expect(screen.getByText("home.pctUsed")).toBeOnTheScreen();
  });

  it("renders yearly label when isYearly", () => {
    render(
      <BudgetChartCard
        isYearly={true}
        budgetDisplayCents={3000000}
        totalCents={1500000}
        availableCents={1500000}
      />,
    );
    expect(screen.getByText("home.yearlyBudget")).toBeOnTheScreen();
  });
});
