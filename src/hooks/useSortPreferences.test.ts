import { renderHook, act, waitFor } from "@testing-library/react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSortPreferences, SortPreferencesProvider } from "../contexts/SortPreferencesContext";
import { DEFAULT_SORT } from "../constants/sort";

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(SortPreferencesProvider, null, children);
}

describe("useSortPreferences", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initial state is DEFAULT_SORT", () => {
    const { result } = renderHook(() => useSortPreferences(), { wrapper });
    expect(result.current.sortPrefs).toEqual(DEFAULT_SORT);
  });

  it("loads saved preferences from AsyncStorage on mount", async () => {
    const saved = {
      categories: "price_desc",
      expenses: "newest",
      wallets: "newest",
    };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(saved),
    );

    const { result } = renderHook(() => useSortPreferences(), { wrapper });

    await waitFor(() => {
      expect(result.current.sortPrefs).toEqual({
        ...DEFAULT_SORT,
        ...saved,
      });
    });
  });

  it("setSortFor updates state and persists to AsyncStorage", async () => {
    const { result } = renderHook(() => useSortPreferences(), { wrapper });

    act(() => {
      result.current.setSortFor("expenses", "price_asc");
    });

    expect(result.current.sortPrefs.expenses).toBe("price_asc");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@fixo/sort_preferences",
      expect.stringContaining("price_asc"),
    );
  });

  it("handles corrupted JSON in AsyncStorage gracefully", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("not-json{{{");

    const { result } = renderHook(() => useSortPreferences(), { wrapper });

    // Should still use defaults after failed parse
    await waitFor(() => {
      expect(result.current.sortPrefs).toEqual(DEFAULT_SORT);
    });
  });
});
