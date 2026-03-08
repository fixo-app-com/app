import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card } from "../../../design-system";
import { CurrencyText } from "../../../components";
import type { PinnedBudgetMetric } from "../../../types/firestore";

type MetricDef = {
  key: PinnedBudgetMetric;
  label: string;
  cents: number;
  colorClass: string;
};

const EXPLAINABLE_METRICS: PinnedBudgetMetric[] = ["costs", "available"];

export function BudgetCard({
  hasIncome,
  isYearly,
  incomeDisplayCents,
  totalCents,
  availableCents,
  pinnedMetric,
  onPin,
  onIncomeEdit,
  onMetricInfo,
}: {
  hasIncome: boolean;
  isYearly: boolean;
  incomeDisplayCents: number;
  totalCents: number;
  availableCents: number;
  pinnedMetric: PinnedBudgetMetric;
  onPin: (m: PinnedBudgetMetric) => void;
  onIncomeEdit: () => void;
  onMetricInfo: (m: PinnedBudgetMetric) => void;
}) {
  const { t } = useTranslation();

  // State: No income set
  if (!hasIncome) {
    return (
      <Card>
        <Pressable
          onPress={onIncomeEdit}
          className="flex-row items-center justify-center py-2"
          testID="set-budget-prompt"
        >
          <Text className="text-sm font-medium text-gray-500">
            {isYearly ? t("home.setYearlyIncome") : t("home.setMonthlyIncome")}
          </Text>
          <Ionicons
            name="create-outline"
            size={18}
            color="#6b7280"
            style={{ marginLeft: 6 }}
          />
        </Pressable>
        <CurrencyText
          cents={totalCents}
          className="text-center text-3xl font-bold text-gray-900"
        />
      </Card>
    );
  }

  // State: Income set — 3 metrics (income, costs, available) + bar
  const allMetrics: MetricDef[] = [
    {
      key: "income",
      label: isYearly ? t("home.yearlyIncome") : t("home.monthlyIncome"),
      cents: incomeDisplayCents,
      colorClass: "text-gray-900",
    },
    {
      key: "costs",
      label: t("home.totalCosts"),
      cents: totalCents,
      colorClass: "text-red-500",
    },
    {
      key: "available",
      label: t("home.available"),
      cents: availableCents,
      colorClass: availableCents >= 0 ? "text-emerald-600" : "text-red-500",
    },
  ];

  const hero = allMetrics.find((m) => m.key === pinnedMetric) ?? allMetrics[0];
  const secondary = allMetrics.filter((m) => m.key !== hero.key);
  const isHeroIncome = hero.key === "income";
  const heroHasInfo = EXPLAINABLE_METRICS.includes(hero.key);

  return (
    <Card>
      <Pressable
        onPress={isHeroIncome ? onIncomeEdit : undefined}
        className="items-center py-1"
        testID="hero-metric"
      >
        <View className="flex-row items-center">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {hero.label}
          </Text>
          {isHeroIncome && (
            <Ionicons
              name="create-outline"
              size={14}
              color="#9ca3af"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
        <View className="flex-row items-center">
          <CurrencyText
            cents={hero.cents}
            className={`mt-1 text-3xl font-bold ${hero.colorClass}`}
            hideDecimals
          />
          {heroHasInfo && (
            <Pressable
              onPress={() => onMetricInfo(hero.key)}
              hitSlop={8}
              testID="hero-info"
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#9ca3af"
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          )}
        </View>
      </Pressable>

      <View className="mt-3 flex-row gap-3">
        {secondary.map((m) => (
          <Pressable
            key={m.key}
            onPress={() => onPin(m.key)}
            className="flex-1 items-center rounded-xl bg-gray-50 p-3"
            testID={`secondary-${m.key}`}
          >
            <Text className="text-xs font-medium text-gray-400">{m.label}</Text>
            <CurrencyText
              cents={m.cents}
              className={`mt-0.5 text-base font-semibold ${m.colorClass}`}
              hideDecimals
            />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}
