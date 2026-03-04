import { useEffect, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import type { Expense } from "../types/firestore";

export function useExpenses(filter?: {
  categoryId?: string;
  walletId?: string;
}): {
  expenses: Expense[];
  loading: boolean;
} {
  const { expenses: allExpenses, expensesLoading, ensureExpenses } = useData();

  useEffect(() => {
    ensureExpenses();
  }, [ensureExpenses]);

  const filtered = useMemo(() => {
    if (!allExpenses) return [];
    let result = allExpenses;
    if (filter?.categoryId) {
      result = result.filter((e) => e.categoryId === filter.categoryId);
    }
    if (filter?.walletId) {
      result = result.filter((e) => e.walletId === filter.walletId);
    }
    // Sort by amountCents desc (matching previous behavior)
    return [...result].sort((a, b) => b.amountCents - a.amountCents);
  }, [allExpenses, filter?.categoryId, filter?.walletId]);

  return {
    expenses: filtered,
    loading: expensesLoading && allExpenses === null,
  };
}
