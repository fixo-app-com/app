import { fireEvent, render, screen } from "@testing-library/react-native";
import { FloatingAction } from "./FloatingAction";

describe("FloatingAction", () => {
  it("renders label", () => {
    render(<FloatingAction label="Add item" onPress={jest.fn()} />);
    expect(screen.getByText("Add item")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<FloatingAction label="Add item" onPress={onPress} />);
    fireEvent.press(screen.getByText("Add item"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
