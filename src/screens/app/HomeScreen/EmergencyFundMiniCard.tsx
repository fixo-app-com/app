import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useData } from "../../../contexts/DataContext";
import { getCurrencySymbol } from "../../../constants/banks";
import { formatAmount } from "../../../utils/formatCurrency";
import type { Expense } from "../../../types/firestore";
import { getDisplayAmountCents, roundToUnit } from "../../../types/firestore";
import { Card, SectionHeader } from "../../../design-system";
import { CurrencyText } from "../../../components";

interface EmergencyFundMiniCardProps {
  expenses: Expense[];
  availableMonthlyCents: number;
  onPress: () => void;
}

export function EmergencyFundMiniCard({
  expenses,
  availableMonthlyCents,
  onPress,
}: EmergencyFundMiniCardProps) {
  const { t } = useTranslation();
  const { emergencyMonths, emergencyMonthlySavingCents, currency } = useData();
  const symbol = getCurrencySymbol(currency);

  const essentialExpenses = expenses.filter((e) => e.priority !== "optional");
  if (essentialExpenses.length === 0) return null;

  const yearlyEssentialCents = essentialExpenses.reduce(
    (sum, e) => sum + getDisplayAmountCents(e, "yearly"),
    0,
  );
  const monthlyEssentialCents = roundToUnit(yearlyEssentialCents / 12);
  const months = emergencyMonths;
  const targetCents = roundToUnit(monthlyEssentialCents * months);

  const savingsPerMonth =
    emergencyMonthlySavingCents > 0
      ? emergencyMonthlySavingCents
      : availableMonthlyCents > 0
        ? availableMonthlyCents
        : 0;
  const savingsFormatted = formatAmount(savingsPerMonth, {
    hideDecimals: true,
    suffixFormat: true,
    symbol,
  });

  let timeEstimate: string;
  if (savingsPerMonth <= 0) {
    timeEstimate = t("home.setSavingsRate");
  } else {
    const monthsToTarget = Math.ceil(targetCents / savingsPerMonth);
    if (monthsToTarget > 120) {
      timeEstimate = t("home.yearsToReach");
    } else {
      timeEstimate = t("home.monthsToReach", {
        count: monthsToTarget,
        amount: savingsFormatted,
      });
    }
  }

  return (
    <View>
      <SectionHeader title={t("home.emergencyFund")} />
      <Card onPress={onPress}>
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
            <Ionicons name="shield-checkmark" size={20} color="#818cf8" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {t("home.emergencyTarget")}
            </Text>
            <CurrencyText
              cents={targetCents}
              className="text-lg font-bold text-gray-900"
              hideDecimals
            />
            <Text className="text-xs text-gray-500">{timeEstimate}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </View>
      </Card>
    </View>
  );
}
