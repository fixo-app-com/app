import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useData } from "../../../contexts/DataContext";
import { getCurrencySymbol } from "../../../constants/banks";
import { formatAmount } from "../../../utils/formatCurrency";
import { Card, SectionHeader } from "../../../design-system";
import { CurrencyText } from "../../../components";

interface DailyBudgetCardProps {
  availableCents: number;
  incomeDisplayCents: number;
  isYearly: boolean;
}

export function DailyBudgetCard({
  availableCents,
  incomeDisplayCents,
  isYearly,
}: DailyBudgetCardProps) {
  const { t } = useTranslation();
  const { currency } = useData();
  const symbol = getCurrencySymbol(currency);

  if (incomeDisplayCents <= 0) return null;

  const days = isYearly ? 365 : 365 / 12;
  const dailyCents = Math.max(0, Math.round(availableCents / days));
  const overBudget = availableCents <= 0;

  const availableFormatted = formatAmount(Math.max(0, availableCents), {
    hideDecimals: true,
    suffixFormat: true,
    symbol,
  });

  return (
    <View>
      <SectionHeader title={t("home.dailyBudget")} />
      <Card>
        <View className="items-center py-1">
          <View className="flex-row items-baseline">
            <CurrencyText
              cents={dailyCents}
              className={`text-3xl font-bold ${overBudget ? "text-red-500" : "text-gray-900"}`}
              hideDecimals
            />
            <Text
              className={`text-lg font-semibold ${overBudget ? "text-red-500" : "text-gray-500"}`}
            >
              {t("home.perDay")}
            </Text>
          </View>
          <Text className="mt-1 text-center text-sm text-gray-500">
            {overBudget
              ? t("home.costsExceedIncome")
              : t("home.fromAvailable", { amount: availableFormatted })}
          </Text>
        </View>
      </Card>
    </View>
  );
}
