import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader } from "../../../design-system";

interface FixedCostRatioCardProps {
  totalCents: number;
  incomeDisplayCents: number;
}

export function FixedCostRatioCard({
  totalCents,
  incomeDisplayCents,
}: FixedCostRatioCardProps) {
  const { t } = useTranslation();

  if (incomeDisplayCents <= 0) return null;

  const pct = Math.round((totalCents / incomeDisplayCents) * 100);

  const colorClass =
    pct <= 50
      ? "text-emerald-600"
      : pct <= 70
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <View>
      <SectionHeader title={t("home.fixedCosts")} />
      <Card>
        <View className="items-center py-1">
          <Text className={`text-3xl font-bold ${colorClass}`}>{pct}%</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            {t("home.ofIncomeFixed")}
          </Text>
          <Text className="mt-1 text-xs text-gray-400">
            {t("home.idealUnder")}
          </Text>
        </View>
      </Card>
    </View>
  );
}
