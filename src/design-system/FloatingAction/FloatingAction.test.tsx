import { fireEvent, render, screen } from "@testing-library/react-native";
import { FloatingAction } from "./FloatingAction";

describe("FloatingAction", () => {
  it("renders the add icon", () => {
    render(<FloatingAction onPress={jest.fn()} />);
    expect(screen.getByLabelText("Add")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<FloatingAction onPress={onPress} />);
    fireEvent.press(screen.getByLabelText("Add"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
