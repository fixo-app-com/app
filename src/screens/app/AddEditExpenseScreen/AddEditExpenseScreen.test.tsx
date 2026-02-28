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
  }),
}));

jest.mock("../../../services/firestore", () => ({
  addExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
  getExpenses: jest.fn(() => Promise.resolve([])),
}));

describe("AddEditExpenseScreen", () => {
  it("renders title for new expense", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("New expense")).toBeOnTheScreen();
  });

  it("renders name input", () => {
    render(<AddEditExpenseScreen />);
    expect(
      screen.getByPlaceholderText("e.g. Netflix, Insurance..."),
    ).toBeOnTheScreen();
  });

  it("renders amount input", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByPlaceholderText("12.99")).toBeOnTheScreen();
  });

  it("renders wallet picker", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("Intesa Sanpaolo")).toBeOnTheScreen();
  });

  it("renders essential toggle", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("Essential expense")).toBeOnTheScreen();
  });

  it("renders save button", () => {
    render(<AddEditExpenseScreen />);
    expect(screen.getByText("Save expense")).toBeOnTheScreen();
  });
});
