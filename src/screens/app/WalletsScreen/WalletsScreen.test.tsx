import { render, screen } from "@testing-library/react-native";
import WalletsScreen from "./WalletsScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    wallets: [
      { id: "w1", name: "Intesa Sanpaolo", createdAt: new Date() },
      { id: "w2", name: "Revolut", createdAt: new Date() },
    ],
    deleteWallet: jest.fn(),
  }),
}));

describe("WalletsScreen", () => {
  it("renders title", () => {
    render(<WalletsScreen />);
    expect(screen.getByText("Wallets")).toBeOnTheScreen();
  });

  it("renders wallet list", () => {
    render(<WalletsScreen />);
    expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
    expect(screen.getByText("Revolut")).toBeOnTheScreen();
  });

  it("renders add wallet button", () => {
    render(<WalletsScreen />);
    expect(screen.getByText("+ Add wallet")).toBeOnTheScreen();
  });
});
