import { render, screen, waitFor } from "@testing-library/react-native";
import EmergencyFundScreen from "./EmergencyFundScreen";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockExpenses = [
  {
    id: "e1",
    categoryId: "c1",
    name: "Rent",
    amountCents: 80000,
    billingFrequency: "monthly",
    walletId: "w1",
    essential: true,
    notes: "",
    createdAt: new Date(),
  },
  {
    id: "e2",
    categoryId: "c1",
    name: "Netflix",
    amountCents: 1599,
    billingFrequency: "monthly",
    walletId: "w1",
    essential: false,
    notes: "",
    createdAt: new Date(),
  },
  {
    id: "e3",
    categoryId: "c2",
    name: "Insurance",
    amountCents: 120000,
    billingFrequency: "yearly",
    walletId: "w1",
    essential: true,
    notes: "",
    createdAt: new Date(),
  },
];

const mockDataContext = {
  currency: "EUR",
  emergencyMonths: 6,
  setEmergencyMonths: jest.fn(),
  expenses: mockExpenses,
  expensesLoading: false,
  ensureExpenses: jest.fn(),
};

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => mockDataContext,
}));

jest.mock("@react-native-community/slider", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <View testID={props.testID as string} />
    ),
  };
});

describe("EmergencyFundScreen", () => {
  beforeEach(() => {
    mockDataContext.expenses = mockExpenses;
  });

  it("renders title and subtitle", () => {
    render(<EmergencyFundScreen />);
    expect(screen.getByText("Emergency Fund")).toBeOnTheScreen();
    expect(
      screen.getByText(/Simulate how much cash you need/),
    ).toBeOnTheScreen();
  });

  it("renders slider with default 6 months label", async () => {
    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("slider")).toBeOnTheScreen();
      expect(screen.getByText("6 months")).toBeOnTheScreen();
    });
  });

  it("renders essentials summary and target sections", async () => {
    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByText("Expenses")).toBeOnTheScreen();
      expect(screen.getByText("Monthly cost")).toBeOnTheScreen();
      expect(screen.getByText("Your target")).toBeOnTheScreen();
    });
  });

  it("renders empty state when no essential expenses", async () => {
    mockDataContext.expenses = [
      {
        id: "e2",
        categoryId: "c1",
        name: "Netflix",
        amountCents: 1599,
        billingFrequency: "monthly",
        walletId: "w1",
        essential: false,
        notes: "",
        createdAt: new Date(),
      },
    ];

    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(
        screen.getByText(/No essential expenses yet/),
      ).toBeOnTheScreen();
    });
  });
});
