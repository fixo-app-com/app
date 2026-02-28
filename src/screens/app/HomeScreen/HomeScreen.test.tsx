import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";

// Stable mock references to prevent infinite re-render loops
const mockUser = { uid: "test-uid" };
const mockCategories = [
  { id: "cat1", name: "Subscriptions", icon: "📺", createdAt: new Date() },
  { id: "cat2", name: "Food", icon: "🍔", createdAt: new Date() },
];
const mockWallets = [
  {
    id: "w1",
    name: "Intesa Sanpaolo",
    icon: "intesa-sanpaolo",
    createdAt: new Date(),
  },
  { id: "w2", name: "Revolut", icon: "revolut", createdAt: new Date() },
];
const mockExpenses = [
  {
    id: "e1",
    categoryId: "cat1",
    name: "Netflix",
    amountCents: 1299,
    walletId: "w1",
    essential: false,
    notes: "",
    createdAt: new Date(),
  },
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
    wallets: mockWallets,
    currency: "EUR",
    isLoading: false,
  }),
}));

jest.mock("../../../services/firestore", () => ({
  getExpenses: jest.fn(() => Promise.resolve(mockExpenses)),
}));

describe("HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Home title", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Home")).toBeOnTheScreen();
  });

  it("renders toggle chips", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Categories")).toBeOnTheScreen();
    expect(screen.getByText("Wallets")).toBeOnTheScreen();
  });

  it("renders categories by default", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText("Subscriptions")).toBeOnTheScreen();
      expect(screen.getByText("Food")).toBeOnTheScreen();
    });
  });

  it("renders wallet view when toggled", async () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByText("Wallets"));
    await waitFor(() => {
      expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
      expect(screen.getByText("Revolut")).toBeOnTheScreen();
    });
  });
});
