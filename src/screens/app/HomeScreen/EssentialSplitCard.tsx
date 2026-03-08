import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Expense, ExpensePriority } from "../../../types/firestore";
import { getDisplayAmountCents, roundToUnit } from "../../../types/firestore";
import { Card, SectionHeader } from "../../../design-system";
import { CurrencyText } from "../../../components";
import type { ViewMode } from "../../../contexts/DataContext";

interface EssentialSplitCardProps {
  expenses: Expense[];
  viewMode: ViewMode;
  onPriorityPress: (priority: ExpensePriority) => void;
}

export function EssentialSplitCard({
  expenses,
  viewMode,
  onPriorityPress,
}: EssentialSplitCardProps) {
  const { t } = useTranslation();

  const { essentialCents, reducibleCents, optionalCents } = useMemo(() => {
    let essential = 0;
    let reducible = 0;
    let optional = 0;
    for (const e of expenses) {
      const amount = getDisplayAmountCents(e, viewMode);
      switch (e.priority) {
        case "essential":
          essential += amount;
          break;
        case "reducible":
          reducible += amount;
          break;
        default:
          optional += amount;
          break;
      }
    }
    return {
      essentialCents: roundToUnit(essential),
      reducibleCents: roundToUnit(reducible),
      optionalCents: roundToUnit(optional),
    };
  }, [expenses, viewMode]);

  if (expenses.length === 0) return null;

  return (
    <View testID="essential-split">
      <SectionHeader title={t("home.essentialCosts")} />
      <Card>
        <View className="flex-row items-center">
          <Pressable
            className="flex-1 items-center"
            onPress={() => onPriorityPress("essential")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <CurrencyText
              cents={essentialCents}
              className="text-xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-amber-500">
              {t("home.essential")}
            </Text>
          </Pressable>
          <View className="w-px self-stretch bg-gray-200" />
          <Pressable
            className="flex-1 items-center"
            onPress={() => onPriorityPress("reducible")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <CurrencyText
              cents={reducibleCents}
              className="text-xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-blue-500">{t("home.reducible")}</Text>
          </Pressable>
          <View className="w-px self-stretch bg-gray-200" />
          <Pressable
            className="flex-1 items-center"
            onPress={() => onPriorityPress("optional")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <CurrencyText
              cents={optionalCents}
              className="text-xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-green-500">{t("home.optional")}</Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
}
