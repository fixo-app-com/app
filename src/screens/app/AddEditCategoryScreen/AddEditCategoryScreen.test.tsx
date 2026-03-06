import { render, screen, fireEvent } from "@testing-library/react-native";
import AddEditCategoryScreen from "./AddEditCategoryScreen";

const mockGoBack = jest.fn();
const mockRouteParams = {};

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockAddCategory = jest.fn(() => Promise.resolve("new-id"));
const mockUpdateCategory = jest.fn(() => Promise.resolve());
jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    addCategory: mockAddCategory,
    updateCategory: mockUpdateCategory,
    deleteCategory: jest.fn(),
    deleteExpensesByCategory: jest.fn(),
  }),
}));

describe("AddEditCategoryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title for new category", () => {
    render(<AddEditCategoryScreen />);
    expect(screen.getByText("New category")).toBeOnTheScreen();
  });

  it("renders name input", () => {
    render(<AddEditCategoryScreen />);
    expect(
      screen.getByPlaceholderText("e.g. Family, Car, Home..."),
    ).toBeOnTheScreen();
  });

  it("renders save button", () => {
    render(<AddEditCategoryScreen />);
    expect(screen.getByText("Save category")).toBeOnTheScreen();
  });

  it("renders emoji picker", () => {
    render(<AddEditCategoryScreen />);
    expect(screen.getByText("👨‍👩‍👧‍👦")).toBeOnTheScreen();
    expect(screen.getByText("🚗")).toBeOnTheScreen();
  });

  it("calls addCategory and navigates back on save", async () => {
    render(<AddEditCategoryScreen />);
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
