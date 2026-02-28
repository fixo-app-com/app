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

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    currency: "EUR",
  }),
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

jest.mock("@react-native-community/slider", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <View testID={props.testID as string} />
    ),
  };
});

jest.mock("../../../services/firestore", () => ({
  getExpenses: jest.fn(() => Promise.resolve(mockExpenses)),
}));

describe("EmergencyFundScreen", () => {
  it("renders title", () => {
    render(<EmergencyFundScreen />);
    expect(screen.getByText("Emergency")).toBeOnTheScreen();
  });

  it("renders slider with default 6 months label", async () => {
    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("slider")).toBeOnTheScreen();
      expect(screen.getByText("6 months")).toBeOnTheScreen();
    });
  });

  it("renders essential total and target labels", async () => {
    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByText("Monthly essential expenses")).toBeOnTheScreen();
      expect(screen.getByText("Emergency fund target")).toBeOnTheScreen();
    });
  });
});
