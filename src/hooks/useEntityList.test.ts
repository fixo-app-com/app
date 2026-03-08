import { renderHook } from "@testing-library/react-native";
import { useEntityList } from "./useEntityList";
import type { Expense } from "../types/firestore";

const expenses: Expense[] = [
  {
    id: "e1",
    categoryId: "cat1",
    name: "Netflix",
    amountCents: 1299,
    billingFrequency: "monthly",
    walletId: "w1",
    priority: "optional",
    notes: "",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "e2",
    categoryId: "cat1",
    name: "Rent",
    amountCents: 80000,
    billingFrequency: "monthly",
    walletId: "w1",
    priority: "essential",
    notes: "",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "e3",
    categoryId: "cat2",
    name: "Insurance",
    amountCents: 120000,
    billingFrequency: "yearly",
    walletId: "w2",
    priority: "essential",
    notes: "",
    createdAt: new Date("2024-03-01"),
  },
];

const categories = [
  { id: "cat1", createdAt: new Date("2024-01-01") },
  { id: "cat2", createdAt: new Date("2024-02-01") },
];

describe("useEntityList", () => {
  it("getTotal computes rounded total for a category in monthly mode", () => {
    const { result } = renderHook(() =>
      useEntityList(categories, expenses, "monthly", "newest", "categoryId"),
    );
    // cat1: 1299 + 80000 = 81299 → remainder 99 >= 30 → 81300
    expect(result.current.getTotal("cat1")).toBe(81300);
    // cat2: round(120000/12) = 10000 → remainder 0 → 10000
    expect(result.current.getTotal("cat2")).toBe(10000);
  });

  it("getTotal computes rounded total in yearly mode", () => {
    const { result } = renderHook(() =>
      useEntityList(categories, expenses, "yearly", "newest", "categoryId"),
    );
    // cat1: 1299*12 + 80000*12 = 15588 + 960000 = 975588 → remainder 88 >= 30 → 975600
    expect(result.current.getTotal("cat1")).toBe(975600);
    // cat2: 120000 → remainder 0 → 120000
    expect(result.current.getTotal("cat2")).toBe(120000);
  });

  it("sorts by newest (date descending)", () => {
    const { result } = renderHook(() =>
      useEntityList(categories, expenses, "monthly", "newest", "categoryId"),
    );
    expect(result.current.sorted.map((c) => c.id)).toEqual(["cat2", "cat1"]);
  });

  it("sorts by price_desc", () => {
    const { result } = renderHook(() =>
      useEntityList(
        categories,
        expenses,
        "monthly",
        "price_desc",
        "categoryId",
      ),
    );
    // cat1 total=81300 > cat2 total=10000
    expect(result.current.sorted.map((c) => c.id)).toEqual(["cat1", "cat2"]);
  });

  it("sorts by price_asc", () => {
    const { result } = renderHook(() =>
      useEntityList(categories, expenses, "monthly", "price_asc", "categoryId"),
    );
    expect(result.current.sorted.map((c) => c.id)).toEqual(["cat2", "cat1"]);
  });

  it("works with walletId key", () => {
    const wallets = [
      { id: "w1", createdAt: new Date("2024-01-01") },
      { id: "w2", createdAt: new Date("2024-02-01") },
    ];
    const { result } = renderHook(() =>
      useEntityList(wallets, expenses, "monthly", "price_desc", "walletId"),
    );
    // w1: 1299+80000=81299→81300, w2: 10000→10000
    expect(result.current.sorted.map((w) => w.id)).toEqual(["w1", "w2"]);
  });
});
