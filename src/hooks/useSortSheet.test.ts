import { renderHook, act } from "@testing-library/react-native";
import React from "react";
import { SortPreferencesProvider } from "../contexts/SortPreferencesContext";
import { useSortSheet } from "./useSortSheet";

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(SortPreferencesProvider, null, children);
}

describe("useSortSheet", () => {
  it("returns initial closed state", () => {
    const { result } = renderHook(() => useSortSheet("categories"), { wrapper });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.selected).toBe("newest");
    expect(result.current.title).toBe("sort.sortBy");
    expect(result.current.options).toHaveLength(3);
  });

  it("opens and closes", () => {
    const { result } = renderHook(() => useSortSheet("categories"), { wrapper });
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it("returns translated trigger label", () => {
    const { result } = renderHook(() => useSortSheet("expenses"), { wrapper });
    expect(result.current.triggerLabel).toBe("sort.newest");
  });
});
