import { fireEvent, render, screen } from "@testing-library/react-native";
import { ViewModeToggle } from "./ViewModeToggle";

describe("ViewModeToggle", () => {
  it("renders monthly and yearly options", () => {
    render(<ViewModeToggle selected="monthly" onSelect={jest.fn()} />);
    expect(screen.getByText("common.monthly")).toBeOnTheScreen();
    expect(screen.getByText("common.yearly")).toBeOnTheScreen();
  });

  it("calls onSelect when yearly is pressed", () => {
    const onSelect = jest.fn();
    render(<ViewModeToggle selected="monthly" onSelect={onSelect} />);
    fireEvent.press(screen.getByText("common.yearly"));
    expect(onSelect).toHaveBeenCalledWith("yearly");
  });
});
