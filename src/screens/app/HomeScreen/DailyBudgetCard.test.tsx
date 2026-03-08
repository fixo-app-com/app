import { render, screen } from "@testing-library/react-native";
import { DailyBudgetCard } from "./DailyBudgetCard";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("DailyBudgetCard", () => {
  const baseProps = {
    availableCents: 150000,
    incomeDisplayCents: 250000,
    isYearly: false,
  };

  it("renders nothing when income is zero", () => {
    const { toJSON } = render(
      <DailyBudgetCard {...baseProps} incomeDisplayCents={0} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders nothing when income is negative", () => {
    const { toJSON } = render(
      <DailyBudgetCard {...baseProps} incomeDisplayCents={-100} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders daily budget section header", () => {
    render(<DailyBudgetCard {...baseProps} />);
    expect(screen.getByText("home.dailyBudget")).toBeOnTheScreen();
  });

  it("renders per-day label", () => {
    render(<DailyBudgetCard {...baseProps} />);
    expect(screen.getByText("home.perDay")).toBeOnTheScreen();
  });

  it("shows fromAvailable text when budget is positive", () => {
    render(<DailyBudgetCard {...baseProps} />);
    expect(screen.queryByText("home.costsExceedIncome")).toBeNull();
  });

  it("shows costsExceedIncome when available is zero", () => {
    render(<DailyBudgetCard {...baseProps} availableCents={0} />);
    expect(screen.getByText("home.costsExceedIncome")).toBeOnTheScreen();
  });

  it("shows costsExceedIncome when available is negative", () => {
    render(<DailyBudgetCard {...baseProps} availableCents={-5000} />);
    expect(screen.getByText("home.costsExceedIncome")).toBeOnTheScreen();
  });
});
