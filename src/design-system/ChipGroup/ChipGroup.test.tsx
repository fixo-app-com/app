import { fireEvent, render, screen } from "@testing-library/react-native";
import { ChipGroup } from "./ChipGroup";

const options = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
  { value: "c", label: "Gamma" },
];

describe("ChipGroup", () => {
  it("renders all options", () => {
    render(<ChipGroup options={options} selected="a" onSelect={jest.fn()} />);
    expect(screen.getByText("Alpha")).toBeOnTheScreen();
    expect(screen.getByText("Beta")).toBeOnTheScreen();
    expect(screen.getByText("Gamma")).toBeOnTheScreen();
  });

  it("calls onSelect with the tapped value", () => {
    const onSelect = jest.fn();
    render(<ChipGroup options={options} selected="a" onSelect={onSelect} />);
    fireEvent.press(screen.getByText("Beta"));
    expect(onSelect).toHaveBeenCalledWith("b");
  });
});
