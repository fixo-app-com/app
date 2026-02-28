import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { getExpenses } from "../services/firestore";
import type { Expense } from "../types/firestore";

export function useFetchExpenses(filter?: {
  categoryId?: string;
  walletId?: string;
}): {
  expenses: Expense[];
  loading: boolean;
  setExpenses: Dispatch<SetStateAction<Expense[]>>;
} {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getExpenses(user.uid, filter);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter?.categoryId, filter?.walletId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchExpenses();
    });
    return unsubscribe;
  }, [navigation, fetchExpenses]);

  return { expenses, loading, setExpenses };
}
