import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { ExpenseForm } from "./ExpenseForm";
import { mockWallets, mockExpenses } from "../../test/fixtures";
import { mockDataContextDefaults } from "../../test/mocks";

const mockUpdateExpense = jest.fn(() => Promise.resolve());
const mockAddExpense = jest.fn(() => Promise.resolve("new-id"));

jest.mock("../../contexts/DataContext", () => ({
  useData: () => ({
    ...mockDataContextDefaults,
    wallets: [mockWallets[0]],
    updateExpense: mockUpdateExpense,
    addExpense: mockAddExpense,
  }),
}));

describe("ExpenseForm", () => {
  const onComplete = jest.fn();

  afterEach(() => {
    onComplete.mockClear();
    mockUpdateExpense.mockClear();
    mockAddExpense.mockClear();
  });

  it("renders empty form for new expense", () => {
    render(<ExpenseForm categoryId="cat1" onComplete={onComplete} />);
    expect(
      screen.getByPlaceholderText("addEditExpense.namePlaceholder"),
    ).toBeOnTheScreen();
    expect(screen.getByText("addEditExpense.saveExpense")).toBeOnTheScreen();
  });

  it("renders pre-filled form for existing expense", () => {
    render(
      <ExpenseForm expense={mockExpenses[0]} onComplete={onComplete} />,
    );
    expect(screen.getByDisplayValue("Netflix")).toBeOnTheScreen();
    expect(screen.getByDisplayValue("12.99")).toBeOnTheScreen();
  });

  it("calls onComplete after successful save on edit", async () => {
    render(
      <ExpenseForm expense={mockExpenses[0]} onComplete={onComplete} />,
    );
    fireEvent.press(screen.getByText("addEditExpense.saveChanges"));
    await waitFor(() => {
      expect(mockUpdateExpense).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it("shows delete button for existing expense", () => {
    render(
      <ExpenseForm expense={mockExpenses[0]} onComplete={onComplete} />,
    );
    expect(screen.getByText("addEditExpense.deleteExpense")).toBeOnTheScreen();
  });

  it("does not show delete button for new expense", () => {
    render(<ExpenseForm categoryId="cat1" onComplete={onComplete} />);
    expect(screen.queryByText("addEditExpense.deleteExpense")).toBeNull();
  });
});
