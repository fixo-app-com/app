import { render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";

// Stable mock references to prevent infinite re-render loops
const mockUser = { uid: "test-uid" };
const mockCategories = [
  { id: "cat1", name: "Famiglia", icon: "👨‍👩‍👧‍👦", createdAt: new Date() },
];

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    addListener: jest.fn(() => jest.fn()),
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: mockUser }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    categories: mockCategories,
    isLoading: false,
  }),
}));

jest.mock("../../../services/firestore", () => ({
  getExpenses: jest.fn(() => Promise.resolve([])),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders month selector", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Monthly total")).toBeOnTheScreen();
  });

  it("renders category cards after loading", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText("Famiglia")).toBeOnTheScreen();
    });
  });

  it("renders add category button", () => {
    render(<HomeScreen />);
    expect(screen.getByText("+ Add category")).toBeOnTheScreen();
  });
});
