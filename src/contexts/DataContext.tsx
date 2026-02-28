import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import type { Category, Wallet } from "../types/firestore";
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
  addCategory: (data: Pick<Category, "name" | "icon">) => Promise<string>;
  updateCategory: (
    categoryId: string,
    data: Partial<Pick<Category, "name" | "icon">>,
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addWallet: (data: Pick<Wallet, "name" | "icon">) => Promise<string>;
  updateWallet: (
    walletId: string,
    data: Partial<Pick<Wallet, "name" | "icon">>,
  ) => Promise<void>;
  deleteWallet: (walletId: string) => Promise<void>;
  setCurrency: (currency: string) => Promise<void>;
  setMonthlyBudget: (cents: number) => Promise<void>;
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
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currency, setCurrencyState] = useState("EUR");
  const [monthlyBudgetCents, setMonthlyBudgetCentsState] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("monthly");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setWallets([]);
      setCurrencyState("EUR");
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
        console.error("Categories subscription error:", error);
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
        console.error("Wallets subscription error:", error);
        walletsReady = true;
        checkReady();
      },
    );

    const unsubSettings = firestoreService.subscribeUserSettings(
      user.uid,
      (settings) => {
        setCurrencyState(settings.currency);
        setMonthlyBudgetCentsState(settings.monthlyBudgetCents ?? 0);
        settingsReady = true;
        checkReady();
      },
      (error) => {
        console.error("Settings subscription error:", error);
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
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  return useContext(DataContext);
}
