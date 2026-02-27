import { fireEvent, render, screen } from "@testing-library/react-native";
import { WalletCard } from "./WalletCard";

describe("WalletCard", () => {
  const props = {
    name: "Revolut",
    onPress: jest.fn(),
    onLongPress: jest.fn(),
  };

  it("renders wallet name", () => {
    render(<WalletCard {...props} />);
    expect(screen.getByText("Revolut")).toBeOnTheScreen();
  });

  it("renders card icon and chevron", () => {
    render(<WalletCard {...props} />);
    expect(screen.getByText("\uD83D\uDCB3")).toBeOnTheScreen();
    expect(screen.getByText("\u203A")).toBeOnTheScreen();
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
