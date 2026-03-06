import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_SORT,
  type SortKey,
  type SortOption,
  type SortPreferences,
} from "../constants/sort";

const STORAGE_KEY = "@fixo/sort_preferences";

export function useSortPreferences() {
  const [sortPrefs, setSortPrefs] = useState<SortPreferences>(DEFAULT_SORT);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setSortPrefs({ ...DEFAULT_SORT, ...JSON.parse(raw) });
        } catch {
          // ignore parse errors
        }
      }
    });
  }, []);

  const setSortFor = useCallback((key: SortKey, value: SortOption) => {
    setSortPrefs((prev) => {
      const next = { ...prev, [key]: value };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { sortPrefs, setSortFor };
}
