import { fireEvent, render, screen } from "@testing-library/react-native";
import { ExpenseCard } from "./ExpenseCard";

// Mock DataContext for CurrencyText
jest.mock("../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("ExpenseCard", () => {
  const props = {
    name: "Netflix",
    walletName: "Revolut",
    essential: false,
    notes: "",
    amountCents: 1299,
    onPress: jest.fn(),
    onLongPress: jest.fn(),
  };

  it("renders name, wallet and amount", () => {
    render(<ExpenseCard {...props} />);
    expect(screen.getByText("Netflix")).toBeOnTheScreen();
    expect(screen.getByText("Revolut")).toBeOnTheScreen();
    expect(screen.getByText("\u20AC12.99")).toBeOnTheScreen();
  });

  it("shows Essential label when essential", () => {
    render(<ExpenseCard {...props} essential />);
    expect(screen.getByText(/Essential/)).toBeOnTheScreen();
  });

  it("does not show Essential label when not essential", () => {
    render(<ExpenseCard {...props} essential={false} />);
    expect(screen.queryByText(/Essential/)).not.toBeOnTheScreen();
  });

  it("renders notes when provided", () => {
    render(<ExpenseCard {...props} notes="Monthly subscription" />);
    expect(screen.getByText("Monthly subscription")).toBeOnTheScreen();
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
