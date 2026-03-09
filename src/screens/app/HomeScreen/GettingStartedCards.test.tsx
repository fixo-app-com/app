import { fireEvent, render, screen } from "@testing-library/react-native";
import { GettingStartedCards } from "./GettingStartedCards";
import {
  mockCategories,
  mockExpenses,
  mockWallets,
} from "../../../test/fixtures";

const navigate = jest.fn();
const navigation = { navigate } as never;

describe("GettingStartedCards", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all ghost sections when data is empty", () => {
    render(
      <GettingStartedCards
        categories={[]}
        expenses={[]}
        wallets={[]}
        navigation={navigation}
      />,
    );

    // Breakdown ghost
    expect(screen.getByText("home.breakdown")).toBeOnTheScreen();
    expect(screen.getByText("home.addFirstCategory")).toBeOnTheScreen();

    // Wallets ghost
    expect(screen.getByText("home.walletBreakdown")).toBeOnTheScreen();
    expect(screen.getByText("Revolut")).toBeOnTheScreen();
    expect(screen.getByText("N26")).toBeOnTheScreen();
    expect(screen.getByText("home.addFirstWallet")).toBeOnTheScreen();

    // Emergency fund ghost
    expect(screen.getByText("home.emergencyFund")).toBeOnTheScreen();
    expect(screen.getByText("home.emergencyTarget")).toBeOnTheScreen();
    expect(screen.getByText("home.addFirstExpense")).toBeOnTheScreen();
  });

  it("hides breakdown ghost when categories exist", () => {
    render(
      <GettingStartedCards
        categories={mockCategories}
        expenses={[]}
        wallets={[]}
        navigation={navigation}
      />,
    );
    expect(screen.queryByText("home.addFirstCategory")).toBeNull();
    // Others still visible
    expect(screen.getByText("home.addFirstWallet")).toBeOnTheScreen();
    expect(screen.getByText("home.addFirstExpense")).toBeOnTheScreen();
  });

  it("hides wallets ghost when wallets exist", () => {
    render(
      <GettingStartedCards
        categories={[]}
        expenses={[]}
        wallets={mockWallets}
        navigation={navigation}
      />,
    );
    expect(screen.queryByText("home.addFirstWallet")).toBeNull();
    // Others still visible
    expect(screen.getByText("home.addFirstCategory")).toBeOnTheScreen();
    expect(screen.getByText("home.addFirstExpense")).toBeOnTheScreen();
  });

  it("hides emergency ghost when expenses exist", () => {
    render(
      <GettingStartedCards
        categories={mockCategories}
        expenses={mockExpenses}
        wallets={[]}
        navigation={navigation}
      />,
    );
    expect(screen.queryByText("home.addFirstExpense")).toBeNull();
    // Wallet ghost still visible
    expect(screen.getByText("home.addFirstWallet")).toBeOnTheScreen();
  });

  it("renders nothing when all data exists", () => {
    const { toJSON } = render(
      <GettingStartedCards
        categories={mockCategories}
        expenses={mockExpenses}
        wallets={mockWallets}
        navigation={navigation}
      />,
    );
    // All sections hidden — only the empty gap-6 wrapper
    expect(screen.queryByText("home.addFirstCategory")).toBeNull();
    expect(screen.queryByText("home.addFirstWallet")).toBeNull();
    expect(screen.queryByText("home.addFirstExpense")).toBeNull();
    expect(toJSON()).toBeTruthy();
  });

  it("navigates to AddEditCategory on category CTA", () => {
    render(
      <GettingStartedCards
        categories={[]}
        expenses={mockExpenses}
        wallets={mockWallets}
        navigation={navigation}
      />,
    );
    fireEvent.press(screen.getByText("home.addFirstCategory"));
    expect(navigate).toHaveBeenCalledWith("AddEditCategory", {});
  });

  it("navigates to AddEditWallet on wallet CTA", () => {
    render(
      <GettingStartedCards
        categories={mockCategories}
        expenses={mockExpenses}
        wallets={[]}
        navigation={navigation}
      />,
    );
    fireEvent.press(screen.getByText("home.addFirstWallet"));
    expect(navigate).toHaveBeenCalledWith("AddEditWallet", {});
  });

  it("navigates to CategoriesTab when no categories on expense CTA", () => {
    render(
      <GettingStartedCards
        categories={[]}
        expenses={[]}
        wallets={mockWallets}
        navigation={navigation}
      />,
    );
    fireEvent.press(screen.getByText("home.addFirstExpense"));
    expect(navigate).toHaveBeenCalledWith("MainTabs", {
      screen: "CategoriesTab",
    });
  });

  it("navigates to AddEditExpense when categories exist on expense CTA", () => {
    render(
      <GettingStartedCards
        categories={mockCategories}
        expenses={[]}
        wallets={mockWallets}
        navigation={navigation}
      />,
    );
    fireEvent.press(screen.getByText("home.addFirstExpense"));
    expect(navigate).toHaveBeenCalledWith("AddEditExpense", {
      categoryId: "cat1",
    });
  });
});
