import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSortPreferences } from "../contexts/SortPreferencesContext";
import {
  getSortLabelKey,
  SORT_OPTIONS,
  type SortKey,
  type SortOption,
} from "../constants/sort";

export function useSortSheet(key: SortKey) {
  const { t } = useTranslation();
  const { sortPrefs, setSortFor } = useSortPreferences();
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const selected = sortPrefs[key];
  const select = useCallback(
    (option: SortOption) => setSortFor(key, option),
    [setSortFor, key],
  );

  const triggerLabel = t(getSortLabelKey(selected));
  const title = t("sort.sortBy");
  const options = SORT_OPTIONS.map((o) => ({
    value: o.value,
    label: t(o.labelKey),
  }));

  return { isOpen, open, close, selected, select, triggerLabel, title, options };
}
