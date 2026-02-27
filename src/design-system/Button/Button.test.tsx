import { fireEvent, render, screen } from "@testing-library/react-native";
import { Button } from "./Button";

describe("Button", () => {
  it("renders label", () => {
    render(<Button label="Save" onPress={jest.fn()} />);
    expect(screen.getByText("Save")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} />);
    fireEvent.press(screen.getByText("Save"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    render(<Button label="Save" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText("Save"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("renders destructive variant text", () => {
    render(<Button label="Delete" variant="destructive" onPress={jest.fn()} />);
    expect(screen.getByText("Delete")).toBeOnTheScreen();
  });

  it("renders outline variant text", () => {
    render(<Button label="Cancel" variant="outline" onPress={jest.fn()} />);
    expect(screen.getByText("Cancel")).toBeOnTheScreen();
  });
});
