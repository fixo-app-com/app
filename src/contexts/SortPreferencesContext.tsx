import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_SORT,
  type SortKey,
  type SortOption,
  type SortPreferences,
} from "../constants/sort";

const STORAGE_KEY = "@fixo/sort_preferences";

interface SortPreferencesContextValue {
  sortPrefs: SortPreferences;
  setSortFor: (key: SortKey, value: SortOption) => void;
}

const SortPreferencesContext = createContext<SortPreferencesContextValue>({
  sortPrefs: DEFAULT_SORT,
  setSortFor: () => {},
});

export function SortPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return (
    <SortPreferencesContext.Provider value={{ sortPrefs, setSortFor }}>
      {children}
    </SortPreferencesContext.Provider>
  );
}

export function useSortPreferences(): SortPreferencesContextValue {
  return useContext(SortPreferencesContext);
}
