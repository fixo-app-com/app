import { useMemo } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Expense } from "../../../types/firestore";
import { getDisplayAmountCents } from "../../../types/firestore";
import { Card, SectionHeader } from "../../../design-system";
import { CurrencyText } from "../../../components";
import type { ViewMode } from "../../../contexts/DataContext";

interface TopExpensesCardProps {
  expenses: Expense[];
  viewMode: ViewMode;
}

export function TopExpensesCard({ expenses, viewMode }: TopExpensesCardProps) {
  const { t } = useTranslation();

  const top5 = useMemo(
    () =>
      [...expenses]
        .sort(
          (a, b) =>
            getDisplayAmountCents(b, viewMode) -
            getDisplayAmountCents(a, viewMode),
        )
        .slice(0, 5),
    [expenses, viewMode],
  );

  if (expenses.length === 0) return null;

  return (
    <View testID="top-expenses">
      <SectionHeader title={t("home.topExpenses")} />
      <Card>
        {top5.map((expense, index) => (
          <View key={expense.id}>
            {index > 0 && <View className="h-px bg-gray-100" />}
            <View
              className={`flex-row items-center justify-between ${
                index === 0
                  ? "pb-3"
                  : index === top5.length - 1
                    ? "pt-3"
                    : "py-3"
              }`}
            >
              <Text
                className="mr-4 flex-1 text-sm font-medium text-gray-900"
                numberOfLines={1}
              >
                {expense.name}
              </Text>
              <CurrencyText
                cents={getDisplayAmountCents(expense, viewMode)}
                className="text-sm font-semibold text-gray-900"
              />
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}
