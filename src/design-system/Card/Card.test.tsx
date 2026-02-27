import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <Text>Card content</Text>
      </Card>,
    );
    expect(screen.getByText("Card content")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(
      <Card onPress={onPress}>
        <Text>Tap me</Text>
      </Card>,
    );
    fireEvent.press(screen.getByText("Tap me"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress when long-pressed", () => {
    const onLongPress = jest.fn();
    render(
      <Card onLongPress={onLongPress}>
        <Text>Hold me</Text>
      </Card>,
    );
    fireEvent(screen.getByText("Hold me"), "longPress");
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
