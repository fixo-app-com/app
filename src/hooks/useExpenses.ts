import { useEffect, useMemo } from "react";
import { useData } from "../contexts/DataContext";
import type { Expense } from "../types/firestore";
import { getDisplayAmountCents } from "../types/firestore";
import type { SortOption } from "../constants/sort";
import { makeSortComparator } from "../utils/sort";

export function useExpenses(filter?: {
  categoryId?: string;
  walletId?: string;
  sort?: SortOption;
}): {
  expenses: Expense[];
  loading: boolean;
} {
  const { expenses: allExpenses, expensesLoading, ensureExpenses, viewMode } = useData();

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
    const comparator = makeSortComparator<Expense>(
      filter?.sort ?? "newest",
      (e) => getDisplayAmountCents(e, viewMode),
      (e) => e.createdAt,
    );
    return [...result].sort(comparator);
  }, [allExpenses, filter?.categoryId, filter?.walletId, filter?.sort, viewMode]);

  return {
    expenses: filtered,
    loading: expensesLoading && allExpenses === null,
  };
}
