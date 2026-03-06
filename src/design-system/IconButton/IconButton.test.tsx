import { fireEvent, render, screen } from "@testing-library/react-native";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(
      <IconButton name="create-outline" onPress={onPress} accessibilityLabel="Edit" />,
    );
    fireEvent.press(screen.getByLabelText("Edit"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders with accessibility role button", () => {
    render(
      <IconButton name="create-outline" onPress={jest.fn()} accessibilityLabel="Edit" />,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeOnTheScreen();
  });
});
