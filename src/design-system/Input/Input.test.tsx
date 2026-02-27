import { fireEvent, render, screen } from "@testing-library/react-native";
import { Input } from "./Input";

describe("Input", () => {
  it("renders label when provided", () => {
    render(<Input label="Name" value="" onChangeText={jest.fn()} />);
    expect(screen.getByText("Name")).toBeOnTheScreen();
  });

  it("does not render label when omitted", () => {
    render(<Input value="" onChangeText={jest.fn()} placeholder="Type..." />);
    expect(screen.queryByText("Name")).not.toBeOnTheScreen();
  });

  it("displays current value", () => {
    render(<Input value="hello" onChangeText={jest.fn()} />);
    expect(screen.getByDisplayValue("hello")).toBeOnTheScreen();
  });

  it("calls onChangeText when typing", () => {
    const onChangeText = jest.fn();
    render(<Input value="" onChangeText={onChangeText} placeholder="Type..." />);
    fireEvent.changeText(screen.getByPlaceholderText("Type..."), "new");
    expect(onChangeText).toHaveBeenCalledWith("new");
  });
});
