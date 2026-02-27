import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import type { Category, Wallet } from "../types/firestore";
import * as firestoreService from "../services/firestore";

interface DataContextValue {
  categories: Category[];
  wallets: Wallet[];
  isLoading: boolean;
  addCategory: (data: Pick<Category, "name" | "icon">) => Promise<string>;
  updateCategory: (
    categoryId: string,
    data: Partial<Pick<Category, "name" | "icon">>,
  ) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addWallet: (data: Pick<Wallet, "name">) => Promise<string>;
  updateWallet: (
    walletId: string,
    data: Partial<Pick<Wallet, "name">>,
  ) => Promise<void>;
  deleteWallet: (walletId: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue>({
  categories: [],
  wallets: [],
  isLoading: true,
  addCategory: async () => "",
  updateCategory: async () => {},
  deleteCategory: async () => {},
  addWallet: async () => "",
  updateWallet: async () => {},
  deleteWallet: async () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setWallets([]);
      setIsLoading(false);
      return;
    }

    let categoriesReady = false;
    let walletsReady = false;

    function checkReady() {
      if (categoriesReady && walletsReady) {
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

    return () => {
      unsubCategories();
      unsubWallets();
    };
  }, [user]);

  const userId = user?.uid ?? "";

  const value: DataContextValue = {
    categories,
    wallets,
    isLoading,
    addCategory: (data) => firestoreService.addCategory(userId, data),
    updateCategory: (id, data) =>
      firestoreService.updateCategory(userId, id, data),
    deleteCategory: (id) => firestoreService.deleteCategory(userId, id),
    addWallet: (data) => firestoreService.addWallet(userId, data),
    updateWallet: (id, data) =>
      firestoreService.updateWallet(userId, id, data),
    deleteWallet: (id) => firestoreService.deleteWallet(userId, id),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  return useContext(DataContext);
}
