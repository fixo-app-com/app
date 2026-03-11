import { render, screen, fireEvent } from "@testing-library/react-native";
import { EssentialSplitCard } from "./EssentialSplitCard";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("EssentialSplitCard", () => {
  const onPriorityPress = jest.fn();

  afterEach(() => onPriorityPress.mockClear());

  it("renders essential, reducible and optional sections", () => {
    render(
      <EssentialSplitCard
        essentialCents={80000}
        reducibleCents={3500}
        optionalCents={1300}
        onPriorityPress={onPriorityPress}
      />,
    );
    expect(screen.getByTestId("essential-split")).toBeOnTheScreen();
    expect(screen.getByText("home.essential")).toBeOnTheScreen();
    expect(screen.getByText("home.reducible")).toBeOnTheScreen();
    expect(screen.getByText("home.optional")).toBeOnTheScreen();
  });

  it("does not render when all values are zero", () => {
    render(
      <EssentialSplitCard
        essentialCents={0}
        reducibleCents={0}
        optionalCents={0}
        onPriorityPress={onPriorityPress}
      />,
    );
    expect(screen.queryByTestId("essential-split")).toBeNull();
  });

  it("calls onPriorityPress with 'essential' when essential column is pressed", () => {
    render(
      <EssentialSplitCard
        essentialCents={80000}
        reducibleCents={3500}
        optionalCents={1300}
        onPriorityPress={onPriorityPress}
      />,
    );
    fireEvent.press(screen.getByText("home.essential"));
    expect(onPriorityPress).toHaveBeenCalledWith("essential");
  });

  it("calls onPriorityPress with 'reducible' when reducible column is pressed", () => {
    render(
      <EssentialSplitCard
        essentialCents={80000}
        reducibleCents={3500}
        optionalCents={1300}
        onPriorityPress={onPriorityPress}
      />,
    );
    fireEvent.press(screen.getByText("home.reducible"));
    expect(onPriorityPress).toHaveBeenCalledWith("reducible");
  });

  it("calls onPriorityPress with 'optional' when optional column is pressed", () => {
    render(
      <EssentialSplitCard
        essentialCents={80000}
        reducibleCents={3500}
        optionalCents={1300}
        onPriorityPress={onPriorityPress}
      />,
    );
    fireEvent.press(screen.getByText("home.optional"));
    expect(onPriorityPress).toHaveBeenCalledWith("optional");
  });
});
