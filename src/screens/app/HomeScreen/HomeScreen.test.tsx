import { render, screen, waitFor } from "@testing-library/react-native";
import HomeScreen from "./HomeScreen";

// Stable mock references to prevent infinite re-render loops
const mockUser = { uid: "test-uid" };
const mockWallets = [
  { id: "w1", name: "Intesa Sanpaolo", icon: "intesa-sanpaolo", createdAt: new Date() },
];
const mockExpenses = [
  { id: "e1", categoryId: "cat1", name: "Netflix", amountCents: 1299, walletId: "w1", essential: false, notes: "", createdAt: new Date() },
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

  it("renders monthly total header", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Monthly total")).toBeOnTheScreen();
  });

  it("renders yearly estimate", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Yearly estimate")).toBeOnTheScreen();
  });

  it("renders wallet cards with expenses after loading", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
    });
  });
});
