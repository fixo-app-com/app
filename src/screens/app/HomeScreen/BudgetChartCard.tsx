import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "../../../design-system";
import { CurrencyText } from "../../../components";
import { SlideContent } from "./BudgetCard";

export function BudgetChartCard({
  isYearly,
  budgetDisplayCents,
  totalCents,
  availableCents,
}: {
  isYearly: boolean;
  budgetDisplayCents: number;
  totalCents: number;
  availableCents: number;
}) {
  const { t } = useTranslation();
  const ratio = budgetDisplayCents > 0 ? totalCents / budgetDisplayCents : 0;
  const pct = Math.round(ratio * 100);
  const barWidth = Math.min(pct, 100);
  const barColor =
    pct <= 50 ? "bg-emerald-500" : pct <= 80 ? "bg-yellow-400" : "bg-red-500";

  return (
    <Card testID="budget-chart-card">
      <SlideContent>
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {isYearly ? t("home.yearlyBudget") : t("home.monthlyBudget")}
          </Text>
          <CurrencyText
            cents={budgetDisplayCents}
            className="text-sm font-semibold text-gray-900"
            hideDecimals
          />
        </View>

        <View>
          <View className="h-4 overflow-hidden rounded-full bg-gray-200">
            <View
              className={`h-4 rounded-full ${barColor}`}
              style={{ width: `${barWidth}%` }}
              testID="budget-bar-fill"
            />
          </View>
          <Text className="mt-2 text-center text-sm font-semibold text-gray-700">
            {t("home.pctUsed", { pct })}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs font-medium text-gray-400">
              {t("home.totalCosts")}
            </Text>
            <CurrencyText
              cents={totalCents}
              className="mt-0.5 text-sm font-semibold text-red-500"
              hideDecimals
            />
          </View>
          <View className="items-end">
            <Text className="text-xs font-medium text-gray-400">{t("home.leftover")}</Text>
            <CurrencyText
              cents={availableCents}
              className={`mt-0.5 text-sm font-semibold ${availableCents >= 0 ? "text-emerald-600" : "text-red-500"}`}
              hideDecimals
            />
          </View>
        </View>
      </SlideContent>
    </Card>
  );
}
