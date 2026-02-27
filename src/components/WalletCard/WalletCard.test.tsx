import { fireEvent, render, screen } from "@testing-library/react-native";
import { WalletCard } from "./WalletCard";

// Mock DataContext for CurrencyText
jest.mock("../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("WalletCard", () => {
  const props = {
    name: "Revolut",
    icon: "revolut",
    onPress: jest.fn(),
    onLongPress: jest.fn(),
  };

  it("renders wallet name", () => {
    render(<WalletCard {...props} />);
    expect(screen.getByText("Revolut")).toBeOnTheScreen();
  });

  it("renders bank icon abbreviation", () => {
    render(<WalletCard {...props} />);
    expect(screen.getByText("R")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<WalletCard {...props} onPress={onPress} />);
    fireEvent.press(screen.getByText("Revolut"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress when long-pressed", () => {
    const onLongPress = jest.fn();
    render(<WalletCard {...props} onLongPress={onLongPress} />);
    fireEvent(screen.getByText("Revolut"), "longPress");
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
