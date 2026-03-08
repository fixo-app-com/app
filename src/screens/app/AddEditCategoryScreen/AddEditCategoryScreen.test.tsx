import { render, screen, fireEvent } from "@testing-library/react-native";
import AddEditCategoryScreen from "./AddEditCategoryScreen";
import {
  mockCreateNavigation,
  mockDataContextDefaults,
} from "../../../test/mocks";

const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockCreateNavigation({ goBack: mockGoBack }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockAddCategory = jest.fn(() => Promise.resolve("new-id"));
const mockUpdateCategory = jest.fn(() => Promise.resolve());
jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    ...mockDataContextDefaults,
    addCategory: mockAddCategory,
    updateCategory: mockUpdateCategory,
  }),
}));

describe("AddEditCategoryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title for new category", () => {
    render(<AddEditCategoryScreen />);
    expect(screen.getByText("addEditCategory.newTitle")).toBeOnTheScreen();
  });

  it("renders name input", () => {
    render(<AddEditCategoryScreen />);
    expect(
      screen.getByPlaceholderText("addEditCategory.namePlaceholder"),
    ).toBeOnTheScreen();
  });

  it("renders save button", () => {
    render(<AddEditCategoryScreen />);
    expect(screen.getByText("addEditCategory.saveCategory")).toBeOnTheScreen();
  });

  it("renders emoji picker", () => {
    render(<AddEditCategoryScreen />);
    expect(screen.getByText("👨‍👩‍👧‍👦")).toBeOnTheScreen();
    expect(screen.getByText("🚗")).toBeOnTheScreen();
  });

  it("calls addCategory and navigates back on save", async () => {
    render(<AddEditCategoryScreen />);
    const input = screen.getByPlaceholderText(
      "addEditCategory.namePlaceholder",
    );
    fireEvent.changeText(input, "Test Category");
    fireEvent.press(screen.getByText("addEditCategory.saveCategory"));

    await screen.findByText("addEditCategory.saveCategory");
    expect(mockAddCategory).toHaveBeenCalledWith({
      name: "Test Category",
      icon: "📦",
    });
  });
});
