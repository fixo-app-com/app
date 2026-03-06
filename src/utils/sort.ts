import type { SortOption } from "../constants/sort";

export function makeSortComparator<T>(
  sortOption: SortOption,
  getPrice: (item: T) => number,
  getCreatedAt: (item: T) => Date,
): (a: T, b: T) => number {
  switch (sortOption) {
    case "price_desc":
      return (a, b) => getPrice(b) - getPrice(a);
    case "price_asc":
      return (a, b) => getPrice(a) - getPrice(b);
    case "newest":
    default:
      return (a, b) => getCreatedAt(b).getTime() - getCreatedAt(a).getTime();
  }
}
