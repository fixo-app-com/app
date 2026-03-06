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

const SLIDE_MIN_HEIGHT = 125;

export function SlideContent({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        minHeight: SLIDE_MIN_HEIGHT,
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  );
}

export function BudgetCard({
  hasBudget,
  isYearly,
  budgetDisplayCents,
  totalCents,
  availableCents,
  pinnedMetric,
  onPin,
  onBudgetEdit,
}: {
  hasBudget: boolean;
  isYearly: boolean;
  budgetDisplayCents: number;
  totalCents: number;
  availableCents: number;
  pinnedMetric: PinnedBudgetMetric;
  onPin: (m: PinnedBudgetMetric) => void;
  onBudgetEdit: () => void;
}) {
  const { t } = useTranslation();

  const metrics: MetricDef[] = [
    {
      key: "budget",
      label: isYearly ? t("home.yearlyBudget") : t("home.monthlyBudget"),
      cents: budgetDisplayCents,
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
      label: t("home.leftover"),
      cents: availableCents,
      colorClass: availableCents >= 0 ? "text-emerald-600" : "text-red-500",
    },
  ];

  if (!hasBudget) {
    return (
      <Card>
        <Pressable
          onPress={onBudgetEdit}
          className="flex-row items-center justify-center py-2"
        >
          <Text className="text-sm font-medium text-gray-500">
            {isYearly ? t("home.setYearlyBudget") : t("home.setMonthlyBudget")}
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

  const hero = metrics.find((m) => m.key === pinnedMetric) ?? metrics[0];
  const secondary = metrics.filter((m) => m.key !== pinnedMetric);
  const isHeroBudget = hero.key === "budget";

  return (
    <Card>
      <SlideContent>
        <Pressable
          onPress={isHeroBudget ? onBudgetEdit : undefined}
          className="items-center py-1"
          testID="hero-metric"
        >
          <View className="flex-row items-center">
            <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {hero.label}
            </Text>
            {isHeroBudget && (
              <Ionicons
                name="create-outline"
                size={14}
                color="#9ca3af"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <CurrencyText
            cents={hero.cents}
            className={`mt-1 text-3xl font-bold ${hero.colorClass}`}
            hideDecimals
          />
        </Pressable>

        <View className="flex-row gap-3">
          {secondary.map((m) => (
            <Pressable
              key={m.key}
              onPress={() => onPin(m.key)}
              className="flex-1 items-center rounded-xl bg-gray-50 p-3"
              testID={`secondary-${m.key}`}
            >
              <Text className="text-xs font-medium text-gray-400">
                {m.label}
              </Text>
              <CurrencyText
                cents={m.cents}
                className={`mt-0.5 text-base font-semibold ${m.colorClass}`}
                hideDecimals
              />
            </Pressable>
          ))}
        </View>
      </SlideContent>
    </Card>
  );
}
