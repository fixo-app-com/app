import { render, screen } from "@testing-library/react-native";
import CategoryDetailScreen from "./CategoryDetailScreen";
import { mockWallets } from "../../../test/fixtures";
import { mockCreateNavigation, mockDataContextDefaults } from "../../../test/mocks";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => mockCreateNavigation({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({
    params: { categoryId: "cat1", categoryName: "Famiglia" },
  }),
}));

jest.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "test-uid" } }),
}));

jest.mock("../../../contexts/DataContext", () => ({
  useData: () => ({
    ...mockDataContextDefaults,
    categories: [
      { id: "cat1", name: "Famiglia", icon: "👨‍👩‍👧‍👦", createdAt: new Date() },
    ],
    wallets: mockWallets,
    expenses: [],
  }),
}));

describe("CategoryDetailScreen", () => {
  it("renders category name in header", () => {
    render(<CategoryDetailScreen />);
    expect(screen.getByText("Famiglia")).toBeOnTheScreen();
  });

  it("renders add expense button", () => {
    render(<CategoryDetailScreen />);
    expect(screen.getByText("categoryDetail.addExpense")).toBeOnTheScreen();
  });
});
