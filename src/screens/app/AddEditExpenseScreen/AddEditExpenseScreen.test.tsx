import { render, screen } from "@testing-library/react-native";
import AddEditExpenseScreen from "./AddEditExpenseScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: { categoryId: "cat1" },
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
    ],
    currency: "EUR",
    addExpense: jest.fn(),
    updateExpense: jest.fn(),
    deleteExpense: jest.fn(),
  }),
}));

jest.mock("../../../services/firestore", () => ({
  getExpenses: jest.fn(() => Promise.resolve([])),
}));

describe("AddEditExpenseScreen", () => {
  it("renders title for new expense", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("addEditExpense.newTitle")).toBeOnTheScreen();
  });

  it("renders name input", () => {
    render(<AddEditExpenseScreen />);
    expect(
      screen.getByPlaceholderText("addEditExpense.namePlaceholder"),
    ).toBeOnTheScreen();
  });

  it("renders amount input", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByPlaceholderText("addEditExpense.amountPlaceholder")).toBeOnTheScreen();
  });

  it("renders wallet picker", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
  });

  it("renders essential toggle", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("addEditExpense.essentialLabel")).toBeOnTheScreen();
  });

  it("renders save button", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("addEditExpense.saveExpense")).toBeOnTheScreen();
  });

  it("renders notes section", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("addEditExpense.notesSection")).toBeOnTheScreen();
  });
});
