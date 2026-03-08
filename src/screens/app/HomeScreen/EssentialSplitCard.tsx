import { useMemo } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Expense } from "../../../types/firestore";
import { getDisplayAmountCents, roundToUnit } from "../../../types/firestore";
import { Card, SectionHeader } from "../../../design-system";
import { CurrencyText } from "../../../components";
import type { ViewMode } from "../../../contexts/DataContext";

interface EssentialSplitCardProps {
  expenses: Expense[];
  viewMode: ViewMode;
}

export function EssentialSplitCard({
  expenses,
  viewMode,
}: EssentialSplitCardProps) {
  const { t } = useTranslation();

  const { essentialCents, nonEssentialCents } = useMemo(() => {
    let essential = 0;
    let nonEssential = 0;
    for (const e of expenses) {
      const amount = getDisplayAmountCents(e, viewMode);
      if (e.essential) {
        essential += amount;
      } else {
        nonEssential += amount;
      }
    }
    return {
      essentialCents: roundToUnit(essential),
      nonEssentialCents: roundToUnit(nonEssential),
    };
  }, [expenses, viewMode]);

  if (expenses.length === 0) return null;

  return (
    <View testID="essential-split">
      <SectionHeader title={t("home.essentialCosts")} />
      <Card>
        <View className="flex-row items-center">
          <View className="flex-1 items-center">
            <CurrencyText
              cents={essentialCents}
              className="text-2xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-amber-500">
              {t("home.essential")}
            </Text>
          </View>
          <View className="w-px self-stretch bg-gray-200" />
          <View className="flex-1 items-center">
            <CurrencyText
              cents={nonEssentialCents}
              className="text-2xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-gray-400">
              {t("home.nonEssential")}
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}
