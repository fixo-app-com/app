import { render, screen, fireEvent } from "@testing-library/react-native";
import AddEditWalletScreen from "./AddEditWalletScreen";
import { mockCreateNavigation, mockDataContextDefaults } from "../../../test/mocks";

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

const mockAddWallet = jest.fn(() => Promise.resolve("new-id"));
jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    ...mockDataContextDefaults,
    addWallet: mockAddWallet,
    expenses: [],
  }),
}));

describe("AddEditWalletScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title for new wallet", () => {
    render(<AddEditWalletScreen />);
    expect(screen.getByText("addEditWallet.newTitle")).toBeOnTheScreen();
  });

  it("renders name input", () => {
    render(<AddEditWalletScreen />);
    expect(
      screen.getByPlaceholderText("addEditWallet.namePlaceholder"),
    ).toBeOnTheScreen();
  });

  it("renders save button", () => {
    render(<AddEditWalletScreen />);
    expect(screen.getByText("addEditWallet.saveWallet")).toBeOnTheScreen();
  });

  it("calls addWallet on save", async () => {
    render(<AddEditWalletScreen />);
    const input = screen.getByPlaceholderText("addEditWallet.namePlaceholder");
    fireEvent.changeText(input, "My Bank");
    fireEvent.press(screen.getByText("addEditWallet.saveWallet"));

    await screen.findByText("addEditWallet.saveWallet");
    expect(mockAddWallet).toHaveBeenCalledWith({ name: "My Bank", icon: "" });
  });
});
