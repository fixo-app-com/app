import { render, screen, waitFor } from "@testing-library/react-native";
import EmergencyFundScreen from "./EmergencyFundScreen";
import { mockExpenses } from "../../../test/fixtures";
import {
  mockCreateNavigation,
  mockDataContextDefaults,
} from "../../../test/mocks";

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockCreateNavigation(),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

const mockDataContext = {
  ...mockDataContextDefaults,
  expenses: mockExpenses,
  wallets: [
    {
      id: "w1",
      name: "Main Account",
      icon: "intesa-sanpaolo",
      createdAt: new Date(),
    },
  ],
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
    expect(screen.getAllByText("emergency.title").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("emergency.description")).toBeOnTheScreen();
  });

  it("renders slider with default 6 months label", async () => {
    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByTestId("slider")).toBeOnTheScreen();
      expect(screen.getByText("emergency.months")).toBeOnTheScreen();
    });
  });

  it("renders essentials summary and target sections", async () => {
    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByText("emergency.essentialExpenses")).toBeOnTheScreen();
      expect(screen.getByText("emergency.monthlyCost")).toBeOnTheScreen();
      expect(screen.getByText("emergency.yourTarget")).toBeOnTheScreen();
      expect(screen.getByText("emergency.targetDetail")).toBeOnTheScreen();
    });
  });

  it("renders empty state when no essential expenses", async () => {
    mockDataContext.expenses = [
      {
        id: "e2",
        categoryId: "c1",
        name: "Netflix",
        amountCents: 1599,
        billingFrequency: "monthly" as const,
        walletId: "w1",
        priority: "optional" as const,
        notes: "",
        createdAt: new Date(),
      },
    ];

    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByText("emergency.noEssential")).toBeOnTheScreen();
    });
  });

  it("renders recommendation tip", async () => {
    render(<EmergencyFundScreen />);
    await waitFor(() => {
      expect(screen.getByText("emergency.recommendation")).toBeOnTheScreen();
    });
  });
});
