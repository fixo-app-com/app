import { render, screen, waitFor } from "@testing-library/react-native";
import WalletsScreen from "./WalletsScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    wallets: [
      {
        id: "w1",
        name: "Intesa Sanpaolo",
        icon: "intesa-sanpaolo",
        createdAt: new Date(),
      },
      { id: "w2", name: "Revolut", icon: "revolut", createdAt: new Date() },
    ],
    currency: "EUR",
    viewMode: "monthly",
    setViewMode: jest.fn(),
    deleteWallet: jest.fn(),
    expenses: [],
    expensesLoading: false,
    ensureExpenses: jest.fn(),
  }),
}));

describe("WalletsScreen", () => {
  it("renders wallet list", async () => {
    render(<WalletsScreen />);
    await waitFor(() => {
      expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
      expect(screen.getByText("Revolut")).toBeOnTheScreen();
    });
  });

  it("renders add wallet button", () => {
    render(<WalletsScreen />);
    expect(screen.getByText("Add wallet")).toBeOnTheScreen();
  });

  it("renders monthly/yearly toggle chips", () => {
    render(<WalletsScreen />);
    expect(screen.getByText("Monthly")).toBeOnTheScreen();
    expect(screen.getByText("Yearly")).toBeOnTheScreen();
  });
});
