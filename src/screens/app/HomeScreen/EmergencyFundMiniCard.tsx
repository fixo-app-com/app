import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useData } from "../../../contexts/DataContext";
import { getCurrencySymbol } from "../../../constants/banks";
import { formatAmount } from "../../../utils/formatCurrency";
import type { Expense } from "../../../types/firestore";
import { Card, SectionHeader } from "../../../design-system";
import { CurrencyText } from "../../../components";

interface EmergencyFundMiniCardProps {
  essentialExpenses: Expense[];
  targetCents: number;
  availableMonthlyCents: number;
  onPress: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatYearsMonths(totalMonths: number, t: any): string {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return t("home.timeMonths", { count: months });
  if (months === 0) return t("home.timeYears", { count: years });
  const yPart = t("home.timeYears", { count: years });
  const mPart = t("home.timeMonths", { count: months });
  return `${yPart} ${t("home.timeAndConnector")} ${mPart}`;
}

export function EmergencyFundMiniCard({
  essentialExpenses,
  targetCents,
  availableMonthlyCents,
  onPress,
}: EmergencyFundMiniCardProps) {
  const { t } = useTranslation();
  const { emergencyMonthlySavingCents, currency } = useData();
  const symbol = getCurrencySymbol(currency);

  if (essentialExpenses.length === 0) return null;

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
      const period = formatYearsMonths(monthsToTarget, t);
      timeEstimate = t("home.timeToReach", {
        period,
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
