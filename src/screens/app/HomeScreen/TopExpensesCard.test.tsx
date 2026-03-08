import { render, screen } from "@testing-library/react-native";
import { TopExpensesCard } from "./TopExpensesCard";
import { mockExpenses } from "../../../test/fixtures";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("TopExpensesCard", () => {
  it("renders top expenses sorted by amount", () => {
    render(<TopExpensesCard expenses={mockExpenses} viewMode="monthly" />);
    expect(screen.getByTestId("top-expenses")).toBeOnTheScreen();
    expect(screen.getByText("Rent")).toBeOnTheScreen();
    expect(screen.getByText("Netflix")).toBeOnTheScreen();
  });

  it("does not render when no expenses", () => {
    render(<TopExpensesCard expenses={[]} viewMode="monthly" />);
    expect(screen.queryByTestId("top-expenses")).toBeNull();
  });

  it("shows at most 5 expenses", () => {
    const many = Array.from({ length: 8 }, (_, i) => ({
      ...mockExpenses[0],
      id: `e${i}`,
      name: `Expense ${i}`,
      amountCents: (i + 1) * 1000,
    }));
    render(<TopExpensesCard expenses={many} viewMode="monthly" />);
    expect(screen.getByText("Expense 7")).toBeOnTheScreen();
    expect(screen.queryByText("Expense 0")).toBeNull();
  });
});
