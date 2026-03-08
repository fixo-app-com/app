import { fireEvent, render, screen } from "@testing-library/react-native";
import { EmergencyFundMiniCard } from "./EmergencyFundMiniCard";
import type { Expense } from "../../../types/firestore";

const mockDataValues = {
  emergencyMonths: 6,
  emergencyMonthlySavingCents: 0,
  currency: "EUR",
};

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => mockDataValues,
}));

const essentialExpense: Expense = {
  id: "e1",
  categoryId: "cat1",
  name: "Rent",
  amountCents: 80000,
  billingFrequency: "monthly",
  walletId: "w1",
  priority: "essential",
  notes: "",
  createdAt: new Date(),
};

const optionalExpense: Expense = {
  id: "e2",
  categoryId: "cat1",
  name: "Netflix",
  amountCents: 1299,
  billingFrequency: "monthly",
  walletId: "w1",
  priority: "optional",
  notes: "",
  createdAt: new Date(),
};

describe("EmergencyFundMiniCard", () => {
  const baseProps = {
    expenses: [essentialExpense, optionalExpense],
    availableMonthlyCents: 50000,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDataValues.emergencyMonths = 6;
    mockDataValues.emergencyMonthlySavingCents = 0;
  });

  it("renders nothing when all expenses are optional", () => {
    const { toJSON } = render(
      <EmergencyFundMiniCard {...baseProps} expenses={[optionalExpense]} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders nothing when expenses array is empty", () => {
    const { toJSON } = render(
      <EmergencyFundMiniCard {...baseProps} expenses={[]} />,
    );
    expect(toJSON()).toBeNull();
  });

  it("renders section header and target label", () => {
    render(<EmergencyFundMiniCard {...baseProps} />);
    expect(screen.getByText("home.emergencyFund")).toBeOnTheScreen();
    expect(screen.getByText("home.emergencyTarget")).toBeOnTheScreen();
  });

  it("shows setSavingsRate when no savings and no available budget", () => {
    render(<EmergencyFundMiniCard {...baseProps} availableMonthlyCents={0} />);
    expect(screen.getByText("home.setSavingsRate")).toBeOnTheScreen();
  });

  it("shows monthsToReach when savings are available via fallback", () => {
    render(<EmergencyFundMiniCard {...baseProps} />);
    expect(screen.queryByText("home.setSavingsRate")).toBeNull();
    expect(screen.queryByText("home.yearsToReach")).toBeNull();
  });

  it("uses emergencyMonthlySavingCents when set", () => {
    mockDataValues.emergencyMonthlySavingCents = 30000;
    render(<EmergencyFundMiniCard {...baseProps} />);
    expect(screen.queryByText("home.setSavingsRate")).toBeNull();
  });

  it("calls onPress when card is pressed", () => {
    const onPress = jest.fn();
    render(<EmergencyFundMiniCard {...baseProps} onPress={onPress} />);
    fireEvent.press(screen.getByText("home.emergencyTarget"));
    expect(onPress).toHaveBeenCalled();
  });
});
