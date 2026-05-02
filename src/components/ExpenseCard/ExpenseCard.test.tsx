import { fireEvent, render, screen } from "@testing-library/react-native";
import { ExpenseCard } from "./ExpenseCard";

// Mock DataContext for CurrencyText and viewMode
jest.mock("../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR", viewMode: "monthly" }),
}));

describe("ExpenseCard", () => {
  const props = {
    name: "Netflix",
    walletName: "Revolut",
    amountCents: 1299,
    billingFrequency: "monthly" as const,
    onPress: jest.fn(),
    onLongPress: jest.fn(),
  };

  it("renders name, wallet and amount", () => {
    render(<ExpenseCard {...props} />);
    expect(screen.getByText("Netflix")).toBeOnTheScreen();
    expect(screen.getByText("Revolut")).toBeOnTheScreen();
    expect(screen.getByText("\u20AC12,99")).toBeOnTheScreen();
  });

  it("shows only the monthly amount (no yearly line)", () => {
    render(<ExpenseCard {...props} />);
    expect(screen.getByText("\u20AC12,99")).toBeOnTheScreen();
    // Yearly line is no longer rendered — only one amount shown
    expect(screen.queryByText("\u20AC155")).toBeNull();
  });

it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<ExpenseCard {...props} onPress={onPress} />);
    fireEvent.press(screen.getByText("Netflix"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress when long-pressed", () => {
    const onLongPress = jest.fn();
    render(<ExpenseCard {...props} onLongPress={onLongPress} />);
    fireEvent(screen.getByText("Netflix"), "longPress");
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
