import { fireEvent, render, screen } from "@testing-library/react-native";
import { CategoryCard } from "./CategoryCard";

describe("CategoryCard", () => {
  const props = {
    icon: "\uD83C\uDFE0",
    name: "Home",
    expenseCount: 3,
    totalCents: 15000,
    onPress: jest.fn(),
  };

  it("renders icon, name and expense count", () => {
    render(<CategoryCard {...props} />);
    expect(screen.getByText("\uD83C\uDFE0")).toBeOnTheScreen();
    expect(screen.getByText("Home")).toBeOnTheScreen();
    expect(screen.getByText("3 expenses")).toBeOnTheScreen();
  });

  it("renders singular expense label for count 1", () => {
    render(<CategoryCard {...props} expenseCount={1} />);
    expect(screen.getByText("1 expense")).toBeOnTheScreen();
  });

  it("renders formatted total", () => {
    render(<CategoryCard {...props} />);
    expect(screen.getByText("\u20AC150.00")).toBeOnTheScreen();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    render(<CategoryCard {...props} onPress={onPress} />);
    fireEvent.press(screen.getByText("Home"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
