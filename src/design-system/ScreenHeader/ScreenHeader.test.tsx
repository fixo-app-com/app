import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ScreenHeader } from "./ScreenHeader";

describe("ScreenHeader", () => {
  it("renders title", () => {
    render(<ScreenHeader title="Details" onBack={jest.fn()} />);
    expect(screen.getByText("Details")).toBeOnTheScreen();
  });

  it("renders back chevron", () => {
    render(<ScreenHeader title="Details" onBack={jest.fn()} />);
    expect(screen.getByText("\u2039")).toBeOnTheScreen();
  });

  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    render(<ScreenHeader title="Details" onBack={onBack} />);
    fireEvent.press(screen.getByText("\u2039"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders right content when provided", () => {
    render(
      <ScreenHeader
        title="Details"
        onBack={jest.fn()}
        right={<Text>Extra</Text>}
      />,
    );
    expect(screen.getByText("Extra")).toBeOnTheScreen();
  });
});
