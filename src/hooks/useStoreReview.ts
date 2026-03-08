import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

const STORAGE_KEY = "@fixo/expense_count";
const THRESHOLDS = [3, 9, 15];

export function useStoreReview() {
  const promptIfEligible = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const count = (raw ? parseInt(raw, 10) : 0) + 1;
      await AsyncStorage.setItem(STORAGE_KEY, String(count));

      if (
        THRESHOLDS.includes(count) &&
        (await StoreReview.isAvailableAsync())
      ) {
        await StoreReview.requestReview();
      }
    } catch {
      // silent — review prompt is non-critical
    }
  }, []);

  return { promptIfEligible };
}
