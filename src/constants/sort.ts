export type SortOption = "newest" | "price_desc" | "price_asc";

export type SortKey = "categories" | "expenses" | "wallets";

export type SortPreferences = Record<SortKey, SortOption>;

export const DEFAULT_SORT: SortPreferences = {
  categories: "newest",
  expenses: "newest",
  wallets: "newest",
};

export type SortLabelKey = "sort.newest" | "sort.highest" | "sort.lowest";

export const SORT_OPTIONS: { value: SortOption; labelKey: SortLabelKey }[] = [
  { value: "newest", labelKey: "sort.newest" },
  { value: "price_desc", labelKey: "sort.highest" },
  { value: "price_asc", labelKey: "sort.lowest" },
];

export function getSortLabelKey(option: SortOption): SortLabelKey {
  return (
    SORT_OPTIONS.find((o) => o.value === option)?.labelKey ?? "sort.newest"
  );
}
