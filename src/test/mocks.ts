import { mockUser, mockCategories, mockWallets, mockExpenses } from "./fixtures";

type NavigationOverrides = {
  navigate?: jest.Mock;
  goBack?: jest.Mock;
  addListener?: jest.Mock;
  popTo?: jest.Mock;
};

export function mockCreateNavigation(overrides?: NavigationOverrides) {
  return {
    navigate: overrides?.navigate ?? jest.fn(),
    goBack: overrides?.goBack ?? jest.fn(),
    addListener: overrides?.addListener ?? jest.fn(() => jest.fn()),
    popTo: overrides?.popTo ?? jest.fn(),
  };
}

export const mockDataContextDefaults = {
  categories: mockCategories,
  wallets: mockWallets,
  currency: "EUR",
  monthlyBudgetCents: 0,
  viewMode: "monthly" as const,
  setViewMode: jest.fn(),
  isLoading: false,
  expenses: mockExpenses,
  expensesLoading: false,
  ensureExpenses: jest.fn(),
  addCategory: jest.fn(() => Promise.resolve("new-id")),
  updateCategory: jest.fn(() => Promise.resolve()),
  deleteCategory: jest.fn(() => Promise.resolve()),
  addWallet: jest.fn(() => Promise.resolve("new-id")),
  updateWallet: jest.fn(() => Promise.resolve()),
  deleteWallet: jest.fn(() => Promise.resolve()),
  setCurrency: jest.fn(() => Promise.resolve()),
  setMonthlyBudget: jest.fn(() => Promise.resolve()),
  addExpense: jest.fn(() => Promise.resolve("new-id")),
  updateExpense: jest.fn(() => Promise.resolve()),
  deleteExpense: jest.fn(() => Promise.resolve()),
  deleteExpensesByCategory: jest.fn(() => Promise.resolve()),
  emergencyMonths: 6,
  setEmergencyMonths: jest.fn(() => Promise.resolve()),
  pinnedBudgetMetric: "budget" as "budget" | "costs" | "available",
  setPinnedBudgetMetric: jest.fn(() => Promise.resolve()),
  language: "en" as const,
  setLanguage: jest.fn(() => Promise.resolve()),
};

export const mockAuthContextDefaults = {
  user: mockUser,
  isLoading: false,
  reloadUser: jest.fn(() => Promise.resolve()),
};
