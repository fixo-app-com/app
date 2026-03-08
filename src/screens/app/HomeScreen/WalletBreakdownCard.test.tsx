import { render, screen } from "@testing-library/react-native";
import { WalletBreakdownCard } from "./WalletBreakdownCard";
import { mockExpenses, mockWallets } from "../../../test/fixtures";

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({ currency: "EUR" }),
}));

describe("WalletBreakdownCard", () => {
  it("renders wallet breakdown with progress bars", () => {
    render(
      <WalletBreakdownCard
        wallets={mockWallets}
        expenses={mockExpenses}
        viewMode="monthly"
      />,
    );
    expect(screen.getByTestId("wallet-breakdown")).toBeOnTheScreen();
    expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
  });

  it("does not render when no expenses", () => {
    render(
      <WalletBreakdownCard
        wallets={mockWallets}
        expenses={[]}
        viewMode="monthly"
      />,
    );
    expect(screen.queryByTestId("wallet-breakdown")).toBeNull();
  });

  it("does not render wallets with zero spend", () => {
    render(
      <WalletBreakdownCard
        wallets={mockWallets}
        expenses={mockExpenses}
        viewMode="monthly"
      />,
    );
    // All mock expenses use w1, so w2 (Revolut) should not appear
    expect(screen.queryByText("Revolut")).toBeNull();
  });
});
