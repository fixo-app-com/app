import { render, screen } from "@testing-library/react-native";
import { WalletBreakdownCard } from "./WalletBreakdownCard";
import { mockWallets } from "../../../test/fixtures";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("WalletBreakdownCard", () => {
  it("renders wallet breakdown with progress bars", () => {
    render(
      <WalletBreakdownCard
        walletSpend={[{ wallet: mockWallets[0], totalCents: 90000 }]}
      />,
    );
    expect(screen.getByTestId("wallet-breakdown")).toBeOnTheScreen();
    expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
  });

  it("does not render when walletSpend is empty", () => {
    render(<WalletBreakdownCard walletSpend={[]} />);
    expect(screen.queryByTestId("wallet-breakdown")).toBeNull();
  });

  it("does not render wallets with zero spend", () => {
    render(
      <WalletBreakdownCard
        walletSpend={[{ wallet: mockWallets[0], totalCents: 90000 }]}
      />,
    );
    // Only w1 is passed, so Revolut should not appear
    expect(screen.queryByText("Revolut")).toBeNull();
  });
});
