import { renderHook } from "@testing-library/react-native";
import { useExpenses } from "./useExpenses";
import { mockExpenses } from "../test/fixtures";
import { mockDataContextDefaults } from "../test/mocks";

const mockUseData = jest.fn(() => mockDataContextDefaults);

jest.mock("../contexts/DataContext", () => ({
  useData: () => mockUseData(),
}));

describe("useExpenses", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseData.mockReturnValue(mockDataContextDefaults);
  });

  it("returns all expenses sorted by newest when no filter", () => {
    const { result } = renderHook(() => useExpenses());
    expect(result.current.expenses).toHaveLength(mockExpenses.length);
    expect(result.current.loading).toBe(false);
  });

  it("filters by categoryId", () => {
    const { result } = renderHook(() => useExpenses({ categoryId: "cat1" }));
    expect(result.current.expenses.every((e) => e.categoryId === "cat1")).toBe(
      true,
    );
  });

  it("filters by walletId", () => {
    const { result } = renderHook(() => useExpenses({ walletId: "w1" }));
    expect(result.current.expenses.every((e) => e.walletId === "w1")).toBe(
      true,
    );
  });

  it("applies custom sort option price_desc", () => {
    const { result } = renderHook(() => useExpenses({ sort: "price_desc" }));
    const names = result.current.expenses.map((e) => e.name);
    // In monthly mode: Rent=80000, Insurance=10000 (120000/12), Gym=3500, Netflix=1299
    // price_desc → Rent, Insurance, Gym, Netflix
    expect(names).toEqual(["Rent", "Insurance", "Gym", "Netflix"]);
  });

  it("returns loading true when expensesLoading and expenses is null", () => {
    mockUseData.mockReturnValue({
      ...mockDataContextDefaults,
      expenses: null as unknown as typeof mockDataContextDefaults.expenses,
      expensesLoading: true,
    });
    const { result } = renderHook(() => useExpenses());
    expect(result.current.loading).toBe(true);
    expect(result.current.expenses).toEqual([]);
  });

  it("calls ensureExpenses on mount", () => {
    const ensureExpenses = jest.fn();
    mockUseData.mockReturnValue({
      ...mockDataContextDefaults,
      ensureExpenses,
    });
    renderHook(() => useExpenses());
    expect(ensureExpenses).toHaveBeenCalled();
  });
});
