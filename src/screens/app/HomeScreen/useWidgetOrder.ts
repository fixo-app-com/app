import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_WIDGET_ORDER } from "./types";
import type { WidgetKey } from "./types";

const STORAGE_KEY = "@fixo/widget_order";

function mergeOrder(stored: WidgetKey[]): WidgetKey[] {
  // Keep only keys that still exist in the default set
  const valid = stored.filter((k) =>
    (DEFAULT_WIDGET_ORDER as string[]).includes(k),
  );
  // Append any new keys that weren't stored yet
  const missing = DEFAULT_WIDGET_ORDER.filter((k) => !valid.includes(k));
  return [...valid, ...missing];
}

export function useWidgetOrder() {
  const [order, setOrder] = useState<WidgetKey[]>(DEFAULT_WIDGET_ORDER);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as WidgetKey[];
          setOrder(mergeOrder(parsed));
        } catch {
          // corrupted — use default
        }
      }
      setLoaded(true);
    });
  }, []);

  const saveOrder = useCallback((newOrder: WidgetKey[]) => {
    setOrder(newOrder);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
  }, []);

  return { order, saveOrder, loaded };
}
