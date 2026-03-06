import { makeSortComparator } from "./sort";

interface TestItem {
  price: number;
  createdAt: Date;
}

const getPrice = (item: TestItem) => item.price;
const getCreatedAt = (item: TestItem) => item.createdAt;

const items: TestItem[] = [
  { price: 100, createdAt: new Date("2024-01-01") },
  { price: 300, createdAt: new Date("2024-03-01") },
  { price: 200, createdAt: new Date("2024-02-01") },
];

describe("makeSortComparator", () => {
  it("sorts by price descending for price_desc", () => {
    const sorted = [...items].sort(
      makeSortComparator("price_desc", getPrice, getCreatedAt),
    );
    expect(sorted.map((i) => i.price)).toEqual([300, 200, 100]);
  });

  it("sorts by price ascending for price_asc", () => {
    const sorted = [...items].sort(
      makeSortComparator("price_asc", getPrice, getCreatedAt),
    );
    expect(sorted.map((i) => i.price)).toEqual([100, 200, 300]);
  });

  it("sorts by date descending for newest", () => {
    const sorted = [...items].sort(
      makeSortComparator("newest", getPrice, getCreatedAt),
    );
    expect(sorted.map((i) => i.price)).toEqual([300, 200, 100]);
  });

  it("defaults to newest for unknown sort option", () => {
    const sorted = [...items].sort(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      makeSortComparator("unknown" as any, getPrice, getCreatedAt),
    );
    expect(sorted.map((i) => i.price)).toEqual([300, 200, 100]);
  });
});
