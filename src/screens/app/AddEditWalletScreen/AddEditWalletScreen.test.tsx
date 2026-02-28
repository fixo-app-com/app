import { render, screen, fireEvent } from "@testing-library/react-native";
import AddEditWalletScreen from "./AddEditWalletScreen";

const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    addListener: jest.fn(() => jest.fn()),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockAddWallet = jest.fn(() => Promise.resolve("new-id"));
jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    addWallet: mockAddWallet,
    updateWallet: jest.fn(),
    deleteWallet: jest.fn(),
  }),
}));

jest.mock("../../../services/firestore", () => ({
  getExpenses: jest.fn(() => Promise.resolve([])),
}));

describe("AddEditWalletScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title for new wallet", () => {
    render(<AddEditWalletScreen />);
    expect(screen.getByText("New wallet")).toBeOnTheScreen();
  });

  it("renders name input", () => {
    render(<AddEditWalletScreen />);
    expect(
      screen.getByPlaceholderText("e.g. Revolut, N26..."),
    ).toBeOnTheScreen();
  });

  it("renders save button", () => {
    render(<AddEditWalletScreen />);
    expect(screen.getByText("Save wallet")).toBeOnTheScreen();
  });

  it("calls addWallet on save", async () => {
    render(<AddEditWalletScreen />);
    const input = screen.getByPlaceholderText("e.g. Revolut, N26...");
    fireEvent.changeText(input, "My Bank");
    fireEvent.press(screen.getByText("Save wallet"));

    await screen.findByText("Save wallet");
    expect(mockAddWallet).toHaveBeenCalledWith({ name: "My Bank", icon: "" });
  });
});
