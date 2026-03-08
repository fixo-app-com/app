import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import CategoriesScreen from "./CategoriesScreen";
import { mockCategories, mockExpenses } from "../../../test/fixtures";
import {
  mockCreateNavigation,
  mockDataContextDefaults,
} from "../../../test/mocks";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockCreateNavigation({ navigate: mockNavigate }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockDataDefaults = {
  ...mockDataContextDefaults,
  categories: mockCategories,
  expenses: mockExpenses,
};

let mockDataOverrides: Partial<typeof mockDataDefaults> = {};

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ ...mockDataDefaults, ...mockDataOverrides }),
}));

describe("CategoriesScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDataOverrides = {};
  });

  it("renders category list", async () => {
    render(<CategoriesScreen />);
    await waitFor(() => {
      expect(screen.getByText("Subscriptions")).toBeOnTheScreen();
      expect(screen.getByText("Food")).toBeOnTheScreen();
    });
  });

  it("renders add category button", () => {
    render(<CategoriesScreen />);
    expect(screen.getByLabelText("Add")).toBeOnTheScreen();
  });

  it("renders monthly/yearly toggle chips", () => {
    render(<CategoriesScreen />);
    expect(screen.getByText("common.monthly")).toBeOnTheScreen();
    expect(screen.getByText("common.yearly")).toBeOnTheScreen();
  });

  it("renders title", () => {
    render(<CategoriesScreen />);
    expect(screen.getByText("categories.title")).toBeOnTheScreen();
  });

  it("shows empty state when no categories", () => {
    mockDataOverrides = { categories: [] };
    render(<CategoriesScreen />);
    expect(screen.getByText("categories.noCategories")).toBeOnTheScreen();
  });

  it("navigates to CategoryDetail on category press", async () => {
    render(<CategoriesScreen />);
    await waitFor(() => {
      expect(screen.getByText("Subscriptions")).toBeOnTheScreen();
    });
    fireEvent.press(screen.getByText("Subscriptions"));
    expect(mockNavigate).toHaveBeenCalledWith("CategoryDetail", {
      categoryId: "cat1",
      categoryName: "Subscriptions",
    });
  });

  it("navigates to AddEditCategory on FAB press", () => {
    render(<CategoriesScreen />);
    fireEvent.press(screen.getByLabelText("Add"));
    expect(mockNavigate).toHaveBeenCalledWith("AddEditCategory", {});
  });
});
