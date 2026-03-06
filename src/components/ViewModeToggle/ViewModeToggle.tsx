import { useTranslation } from "react-i18next";
import { ChipGroup } from "../../design-system";
import type { ViewMode } from "../../contexts/DataContext";

type Props = {
  selected: ViewMode;
  onSelect: (mode: ViewMode) => void;
};

export function ViewModeToggle({ selected, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <ChipGroup
      options={[
        { value: "monthly" as ViewMode, label: t("common.monthly") },
        { value: "yearly" as ViewMode, label: t("common.yearly") },
      ]}
      selected={selected}
      onSelect={onSelect}
      compact
    />
  );
}
