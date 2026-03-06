import { useMemo } from "react";
import { roundToUnit, getDisplayAmountCents } from "../types/firestore";
import type { Expense } from "../types/firestore";
import type { SortOption } from "../constants/sort";
import { makeSortComparator } from "../utils/sort";

/**
 * Sorts entities by the given sort option and provides a getTotal helper
 * that computes the rounded display total for a given entity ID.
 */
export function useEntityList<T extends { id: string; createdAt: Date }>(
  entities: T[],
  expenses: Expense[],
  viewMode: "monthly" | "yearly",
  sortOption: SortOption,
  expenseKey: keyof Pick<Expense, "categoryId" | "walletId">,
): { sorted: T[]; getTotal: (id: string) => number } {
  const getTotal = (id: string): number =>
    roundToUnit(
      expenses
        .filter((e) => e[expenseKey] === id)
        .reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
    );

  const sorted = useMemo(() => {
    const comparator = makeSortComparator<T>(
      sortOption,
      (item) => getTotal(item.id),
      (item) => item.createdAt,
    );
    return [...entities].sort(comparator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities, sortOption, expenses, viewMode]);

  return { sorted, getTotal };
}
