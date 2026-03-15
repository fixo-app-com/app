import { renderHook } from "@testing-library/react-native";
import { useBudgetSummary } from "./useBudgetSummary";
import { mockCategories, mockExpenses, mockWallets } from "../test/fixtures";

describe("useBudgetSummary", () => {
  const base = {
    expenses: mockExpenses,
    categories: mockCategories,
    wallets: mockWallets,
    monthlyIncomeCents: 300000,
    viewMode: "monthly" as const,
    emergencyMonths: 6,
    emergencyPriorities: ["essential", "reducible"] as (
      | "essential"
      | "reducible"
      | "optional"
    )[],
  };

  it("priority splits sum exactly to totalCents", () => {
    const { result } = renderHook(() => useBudgetSummary(base));
    const b = result.current;
    expect(b.essentialCents + b.reducibleCents + b.optionalCents).toBe(
      b.totalCents,
    );
  });

  it("priority splits sum exactly to totalCents in yearly mode", () => {
    const { result } = renderHook(() =>
      useBudgetSummary({ ...base, viewMode: "yearly" }),
    );
    const b = result.current;
    expect(b.essentialCents + b.reducibleCents + b.optionalCents).toBe(
      b.totalCents,
    );
  });

  it("computes availableCents as income minus total", () => {
    const { result } = renderHook(() => useBudgetSummary(base));
    const b = result.current;
    expect(b.availableCents).toBe(b.incomeDisplayCents - b.totalCents);
  });

  it("yearly incomeDisplayCents is 12x monthly", () => {
    const { result } = renderHook(() =>
      useBudgetSummary({ ...base, viewMode: "yearly" }),
    );
    expect(result.current.incomeDisplayCents).toBe(300000 * 12);
  });

  it("donut segments have positive totalCents only", () => {
    const { result } = renderHook(() => useBudgetSummary(base));
    for (const seg of result.current.donutSegments) {
      expect(seg.totalCents).toBeGreaterThan(0);
    }
  });

  it("walletSpend sorted descending by totalCents", () => {
    const { result } = renderHook(() => useBudgetSummary(base));
    const spend = result.current.walletSpend;
    for (let i = 1; i < spend.length; i++) {
      expect(spend[i - 1].totalCents).toBeGreaterThanOrEqual(
        spend[i].totalCents,
      );
    }
  });

  it("essentialExpenses includes only priorities in emergencyPriorities", () => {
    const { result } = renderHook(() => useBudgetSummary(base));
    for (const e of result.current.essentialExpenses) {
      expect(["essential", "reducible"]).toContain(e.priority);
    }
  });

  it("essentialExpenses includes only essential when only essential selected", () => {
    const { result } = renderHook(() =>
      useBudgetSummary({
        ...base,
        emergencyPriorities: ["essential"],
      }),
    );
    for (const e of result.current.essentialExpenses) {
      expect(e.priority).toBe("essential");
    }
  });

  it("returns zero totals for empty expenses", () => {
    const { result } = renderHook(() =>
      useBudgetSummary({ ...base, expenses: [] }),
    );
    const b = result.current;
    expect(b.totalCents).toBe(0);
    expect(b.essentialCents).toBe(0);
    expect(b.reducibleCents).toBe(0);
    expect(b.optionalCents).toBe(0);
    expect(b.donutSegments).toHaveLength(0);
    expect(b.walletSpend).toHaveLength(0);
  });
});
