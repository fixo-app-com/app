import { render, screen, fireEvent } from "@testing-library/react-native";
import AddCategoryScreen from "./AddCategoryScreen";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

const mockAddCategory = jest.fn(() => Promise.resolve("new-id"));
jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    addCategory: mockAddCategory,
  }),
}));

describe("AddCategoryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title", () => {
    render(<AddCategoryScreen />);
    expect(screen.getByText("New category")).toBeOnTheScreen();
  });

  it("renders name input", () => {
    render(<AddCategoryScreen />);
    expect(
      screen.getByPlaceholderText("e.g. Family, Car, Home..."),
    ).toBeOnTheScreen();
  });

  it("renders save button", () => {
    render(<AddCategoryScreen />);
    expect(screen.getByText("Save category")).toBeOnTheScreen();
  });

  it("renders emoji picker", () => {
    render(<AddCategoryScreen />);
    expect(screen.getByText("📦")).toBeOnTheScreen();
    expect(screen.getByText("🚗")).toBeOnTheScreen();
  });

  it("calls addCategory and navigates back on save", async () => {
    render(<AddCategoryScreen />);
    const input = screen.getByPlaceholderText("e.g. Family, Car, Home...");
    fireEvent.changeText(input, "Test Category");
    fireEvent.press(screen.getByText("Save category"));

    await screen.findByText("Save category");
    expect(mockAddCategory).toHaveBeenCalledWith({
      name: "Test Category",
      icon: "📦",
    });
  });
});
