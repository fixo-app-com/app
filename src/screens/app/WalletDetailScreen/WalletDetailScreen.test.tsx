import { render, screen } from "@testing-library/react-native";
import WalletDetailScreen from "./WalletDetailScreen";
import { mockCategories, mockWallets } from "../../../test/fixtures";
import { mockCreateNavigation, mockDataContextDefaults } from "../../../test/mocks";

const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockCreateNavigation({ goBack: mockGoBack }),
  useRoute: () => ({
    params: { walletId: "w1", walletName: "Intesa Sanpaolo", walletIcon: "intesa-sanpaolo" },
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    ...mockDataContextDefaults,
    wallets: mockWallets,
    categories: mockCategories,
    expenses: [],
  }),
}));

describe("WalletDetailScreen", () => {
  it("renders wallet name in header", () => {
    render(<WalletDetailScreen />);
    expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
  });

  it("renders empty state when no expenses", () => {
    render(<WalletDetailScreen />);
    expect(screen.getByText("walletDetail.noExpenses")).toBeOnTheScreen();
  });
});
