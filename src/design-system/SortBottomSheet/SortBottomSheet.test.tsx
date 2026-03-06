import { fireEvent, render, screen } from "@testing-library/react-native";
import { SortBottomSheet } from "./SortBottomSheet";

const mockOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price_desc", label: "Highest first" },
  { value: "price_asc", label: "Lowest first" },
];

describe("SortBottomSheet", () => {
  const defaultProps = {
    visible: true,
    title: "Sort by",
    options: mockOptions,
    selected: "newest" as string,
    onSelect: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title and all options", () => {
    render(<SortBottomSheet {...defaultProps} />);
    expect(screen.getByText("Sort by")).toBeOnTheScreen();
    expect(screen.getByText("Newest first")).toBeOnTheScreen();
    expect(screen.getByText("Highest first")).toBeOnTheScreen();
    expect(screen.getByText("Lowest first")).toBeOnTheScreen();
  });

  it("calls onSelect and onClose when an option is pressed", () => {
    render(<SortBottomSheet {...defaultProps} />);
    fireEvent.press(screen.getByText("Highest first"));
    expect(defaultProps.onSelect).toHaveBeenCalledWith("price_desc");
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
