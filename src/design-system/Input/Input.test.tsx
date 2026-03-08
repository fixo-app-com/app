import { fireEvent, render, screen } from "@testing-library/react-native";
import { Input } from "./Input";

describe("Input", () => {
  it("displays current value", () => {
    render(<Input value="hello" onChangeText={jest.fn()} />);
    expect(screen.getByDisplayValue("hello")).toBeOnTheScreen();
  });

  it("calls onChangeText when typing", () => {
    const onChangeText = jest.fn();
    render(
      <Input value="" onChangeText={onChangeText} placeholder="Type..." />,
    );
    fireEvent.changeText(screen.getByPlaceholderText("Type..."), "new");
    expect(onChangeText).toHaveBeenCalledWith("new");
  });
});
