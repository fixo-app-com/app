import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import type { Category, Expense, Wallet } from "../types/firestore";
import * as firestoreService from "../services/firestore";

export type ViewMode = "monthly" | "yearly";

interface DataContextValue {
  categories: Category[];
  wallets: Wallet[];
  currency: string;
  monthlyBudgetCents: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isLoading: boolean;
  // Categories
  addCategory: (data: Pick<Category, "name" | "icon">) => Promise<string>;
  updateCategory: (
    categoryId: string,
    data: Partial<Pick<Category, "name" | "icon">>,
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  // Wallets
  addWallet: (data: Pick<Wallet, "name" | "icon">) => Promise<string>;
  updateWallet: (
    walletId: string,
    data: Partial<Pick<Wallet, "name" | "icon">>,
  ) => Promise<void>;
  deleteWallet: (walletId: string) => Promise<void>;
  // Settings
  setCurrency: (currency: string) => Promise<void>;
  setMonthlyBudget: (cents: number) => Promise<void>;
  // Expenses (centralized)
  expenses: Expense[] | null;
  expensesLoading: boolean;
  ensureExpenses: () => Promise<void>;
  addExpense: (data: Omit<Expense, "id" | "createdAt">) => Promise<string>;
  updateExpense: (
    expenseId: string,
    data: Partial<Omit<Expense, "id" | "createdAt">>,
  ) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  deleteExpensesByCategory: (categoryId: string) => Promise<void>;
  // Emergency fund
  emergencyMonths: number;
  setEmergencyMonths: (months: number) => Promise<void>;
}

const DataContext = createContext<DataContextValue>({
  categories: [],
  wallets: [],
  currency: "EUR",
  monthlyBudgetCents: 0,
  viewMode: "monthly",
  setViewMode: () => {},
  isLoading: true,
  addCategory: async () => "",
  updateCategory: async () => {},
  deleteCategory: async () => {},
  addWallet: async () => "",
  updateWallet: async () => {},
  deleteWallet: async () => {},
  setCurrency: async () => {},
  setMonthlyBudget: async () => {},
  expenses: null,
  expensesLoading: false,
  ensureExpenses: async () => {},
  addExpense: async () => "",
  updateExpense: async () => {},
  deleteExpense: async () => {},
  deleteExpensesByCategory: async () => {},
  emergencyMonths: 6,
  setEmergencyMonths: async () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currency, setCurrencyState] = useState("EUR");
  const [monthlyBudgetCents, setMonthlyBudgetCentsState] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [isLoading, setIsLoading] = useState(true);

  // Centralized expense state
  const [expenses, setExpenses] = useState<Expense[] | null>(null);
  const [expensesLoading, setExpensesLoading] = useState(false);

  // Emergency fund months
  const [emergencyMonths, setEmergencyMonthsState] = useState(6);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setWallets([]);
      setCurrencyState("EUR");
      setMonthlyBudgetCentsState(0);
      setEmergencyMonthsState(6);
      setExpenses(null);
      setIsLoading(false);
      return;
    }

    let categoriesReady = false;
    let walletsReady = false;
    let settingsReady = false;

    function checkReady() {
      if (categoriesReady && walletsReady && settingsReady) {
        setIsLoading(false);
      }
    }

    const unsubCategories = firestoreService.subscribeCategories(
      user.uid,
      (cats) => {
        setCategories(cats);
        categoriesReady = true;
        checkReady();
      },
      (error) => {
        if (__DEV__) console.error("Categories subscription error:", error);
        categoriesReady = true;
        checkReady();
      },
    );

    const unsubWallets = firestoreService.subscribeWallets(
      user.uid,
      (w) => {
        setWallets(w);
        walletsReady = true;
        checkReady();
      },
      (error) => {
        if (__DEV__) console.error("Wallets subscription error:", error);
        walletsReady = true;
        checkReady();
      },
    );

    const unsubSettings = firestoreService.subscribeUserSettings(
      user.uid,
      (settings) => {
        setCurrencyState(settings.currency);
        setMonthlyBudgetCentsState(settings.monthlyBudgetCents ?? 0);
        setEmergencyMonthsState(settings.emergencyMonths ?? 6);
        settingsReady = true;
        checkReady();
      },
      (error) => {
        if (__DEV__) console.error("Settings subscription error:", error);
        settingsReady = true;
        checkReady();
      },
    );

    return () => {
      unsubCategories();
      unsubWallets();
      unsubSettings();
    };
  }, [user]);

  const userId = user?.uid ?? "";

  const ensureExpenses = useCallback(async () => {
    if (expenses !== null || expensesLoading || !user) return;
    setExpensesLoading(true);
    try {
      const data = await firestoreService.getExpenses(user.uid);
      setExpenses(data);
    } catch (error) {
      if (__DEV__) console.error("Failed to load expenses:", error);
      setExpenses([]);
    } finally {
      setExpensesLoading(false);
    }
  }, [expenses, expensesLoading, user]);

  const value: DataContextValue = {
    categories,
    wallets,
    currency,
    monthlyBudgetCents,
    viewMode,
    setViewMode,
    isLoading,
    addCategory: (data) => firestoreService.addCategory(userId, data),
    updateCategory: (id, data) =>
      firestoreService.updateCategory(userId, id, data),
    deleteCategory: (id) => firestoreService.deleteCategory(userId, id),
    addWallet: (data) => firestoreService.addWallet(userId, data),
    updateWallet: (id, data) => firestoreService.updateWallet(userId, id, data),
    deleteWallet: (id) => firestoreService.deleteWallet(userId, id),
    setCurrency: async (curr) => {
      setCurrencyState(curr);
      await firestoreService.updateUserSettings(userId, { currency: curr });
    },
    setMonthlyBudget: async (cents) => {
      setMonthlyBudgetCentsState(cents);
      await firestoreService.updateUserSettings(userId, {
        monthlyBudgetCents: cents,
      });
    },
    // Expenses
    expenses,
    expensesLoading,
    ensureExpenses,
    addExpense: async (data) => {
      const id = await firestoreService.addExpense(userId, data);
      const newExpense: Expense = {
        ...data,
        id,
        createdAt: new Date(),
      };
      setExpenses((prev) => (prev ? [...prev, newExpense] : [newExpense]));
      return id;
    },
    updateExpense: async (expenseId, data) => {
      await firestoreService.updateExpense(userId, expenseId, data);
      setExpenses(
        (prev) =>
          prev?.map((e) => (e.id === expenseId ? { ...e, ...data } : e)) ??
          null,
      );
    },
    deleteExpense: async (expenseId) => {
      await firestoreService.deleteExpense(userId, expenseId);
      setExpenses((prev) => prev?.filter((e) => e.id !== expenseId) ?? null);
    },
    deleteExpensesByCategory: async (categoryId) => {
      await firestoreService.deleteExpensesByCategory(userId, categoryId);
      setExpenses(
        (prev) => prev?.filter((e) => e.categoryId !== categoryId) ?? null,
      );
    },
    // Emergency fund
    emergencyMonths,
    setEmergencyMonths: async (months) => {
      setEmergencyMonthsState(months);
      await firestoreService.updateUserSettings(userId, {
        emergencyMonths: months,
      });
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  return useContext(DataContext);
}
