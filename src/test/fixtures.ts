import type { Category, Expense, Wallet } from "../types/firestore";

export const mockUser = { uid: "test-uid", email: "test@example.com" };

export const mockCategories: Category[] = [
  { id: "cat1", name: "Subscriptions", icon: "📺", createdAt: new Date() },
  { id: "cat2", name: "Food", icon: "🍔", createdAt: new Date() },
];

export const mockWallets: Wallet[] = [
  {
    id: "w1",
    name: "Intesa Sanpaolo",
    icon: "intesa-sanpaolo",
    createdAt: new Date(),
  },
  { id: "w2", name: "Revolut", icon: "revolut", createdAt: new Date() },
];

export const mockExpenses: Expense[] = [
  {
    id: "e1",
    categoryId: "cat1",
    name: "Netflix",
    amountCents: 1299,
    billingFrequency: "monthly",
    walletId: "w1",
    essential: false,
    notes: "",
    createdAt: new Date(),
  },
  {
    id: "e2",
    categoryId: "cat1",
    name: "Rent",
    amountCents: 80000,
    billingFrequency: "monthly",
    walletId: "w1",
    essential: true,
    notes: "",
    createdAt: new Date(),
  },
  {
    id: "e3",
    categoryId: "cat2",
    name: "Insurance",
    amountCents: 120000,
    billingFrequency: "yearly",
    walletId: "w1",
    essential: true,
    notes: "",
    createdAt: new Date(),
  },
];
