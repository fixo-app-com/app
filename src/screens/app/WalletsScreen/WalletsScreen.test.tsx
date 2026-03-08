import { render, screen, waitFor } from "@testing-library/react-native";
import WalletsScreen from "./WalletsScreen";
import { mockWallets } from "../../../test/fixtures";
import {
  mockCreateNavigation,
  mockDataContextDefaults,
} from "../../../test/mocks";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockCreateNavigation(),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    ...mockDataContextDefaults,
    wallets: mockWallets,
    expenses: [],
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
    expect(screen.getByLabelText("Add")).toBeOnTheScreen();
  });

  it("renders monthly/yearly toggle chips", () => {
    render(<WalletsScreen />);
    expect(screen.getByText("common.monthly")).toBeOnTheScreen();
    expect(screen.getByText("common.yearly")).toBeOnTheScreen();
  });
});
