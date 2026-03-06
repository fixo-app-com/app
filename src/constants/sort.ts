export type SortOption = "newest" | "price_desc" | "price_asc";

export type SortKey = "categories" | "expenses" | "wallets";

export type SortPreferences = Record<SortKey, SortOption>;

export const DEFAULT_SORT: SortPreferences = {
  categories: "newest",
  expenses: "newest",
  wallets: "newest",
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_desc", label: "Highest" },
  { value: "price_asc", label: "Lowest" },
];

export function getSortLabel(option: SortOption): string {
  return SORT_OPTIONS.find((o) => o.value === option)?.label ?? "Newest";
}
