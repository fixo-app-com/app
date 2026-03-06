import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import type {
  Category,
  Expense,
  PinnedBudgetMetric,
  SupportedLanguage,
  Wallet,
} from "../types/firestore";
import * as firestoreService from "../services/firestore";
import i18n, { setLanguage as setI18nLanguage } from "../i18n";

const PINNED_METRIC_KEY = "pinnedBudgetMetric";

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
  emergencySavedCents: number;
  setEmergencySavedCents: (cents: number) => Promise<void>;
  emergencyMonthlySavingCents: number;
  setEmergencyMonthlySavingCents: (cents: number) => Promise<void>;
  // Pinned budget metric
  pinnedBudgetMetric: PinnedBudgetMetric;
  setPinnedBudgetMetric: (metric: PinnedBudgetMetric) => Promise<void>;
  // Language
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
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
  emergencySavedCents: 0,
  setEmergencySavedCents: async () => {},
  emergencyMonthlySavingCents: 0,
  setEmergencyMonthlySavingCents: async () => {},
  pinnedBudgetMetric: "budget",
  setPinnedBudgetMetric: async () => {},
  language: "en",
  setLanguage: async () => {},
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
  const [emergencySavedCents, setEmergencySavedCentsState] = useState(0);
  const [emergencyMonthlySavingCents, setEmergencyMonthlySavingCentsState] =
    useState(0);

  // Language
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  // Pinned budget metric (local-only, persisted via AsyncStorage)
  const [pinnedBudgetMetric, setPinnedBudgetMetricState] =
    useState<PinnedBudgetMetric>("budget");

  useEffect(() => {
    AsyncStorage.getItem(PINNED_METRIC_KEY).then((value) => {
      if (value === "budget" || value === "costs" || value === "available") {
        setPinnedBudgetMetricState(value);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setWallets([]);
      setCurrencyState("EUR");
      setMonthlyBudgetCentsState(0);
      setEmergencyMonthsState(6);
      setEmergencySavedCentsState(0);
      setEmergencyMonthlySavingCentsState(0);
      setLanguageState("en");
      setPinnedBudgetMetricState("budget");
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
        setEmergencySavedCentsState(settings.emergencySavedCents ?? 0);
        setEmergencyMonthlySavingCentsState(
          settings.emergencyMonthlySavingCents ?? 0,
        );
        if (settings.language) {
          setLanguageState(settings.language);
          setI18nLanguage(settings.language);
        } else {
          // First login: persist current language to Firestore
          const currentLang =
            (i18n.language as SupportedLanguage) || "en";
          firestoreService.updateUserSettings(user.uid, {
            language: currentLang,
          });
        }
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
    emergencySavedCents,
    setEmergencySavedCents: async (cents) => {
      setEmergencySavedCentsState(cents);
      await firestoreService.updateUserSettings(userId, {
        emergencySavedCents: cents,
      });
    },
    emergencyMonthlySavingCents,
    setEmergencyMonthlySavingCents: async (cents) => {
      setEmergencyMonthlySavingCentsState(cents);
      await firestoreService.updateUserSettings(userId, {
        emergencyMonthlySavingCents: cents,
      });
    },
    // Pinned budget metric
    pinnedBudgetMetric,
    setPinnedBudgetMetric: async (metric) => {
      setPinnedBudgetMetricState(metric);
      await AsyncStorage.setItem(PINNED_METRIC_KEY, metric);
    },
    // Language
    language,
    setLanguage: async (lang) => {
      setLanguageState(lang);
      await setI18nLanguage(lang);
      await firestoreService.updateUserSettings(userId, { language: lang });
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  return useContext(DataContext);
}
