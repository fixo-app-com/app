import { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { getDisplayAmountCents, roundToUnit } from "../../../types/firestore";
import { ScreenWrapper } from "../../../design-system";
import { CurrencyText } from "../../../components";
import { useFetchExpenses } from "../../../hooks/useFetchExpenses";

const SNAP_POINTS: number[] = [3, 6, 12, 18, 24, 36, 48, 60];

function formatPeriod(months: number): string {
  if (months < 12) return `${months} months`;
  const years = months / 12;
  const yStr = Number.isInteger(years) ? `${years}` : years.toFixed(1);
  return `${yStr} ${years === 1 ? "year" : "years"}`;
}

export default function EmergencyFundScreen() {
  const { expenses, loading } = useFetchExpenses();
  const [selectedMonths, setSelectedMonths] = useState(6);

  const essentialExpenses = expenses.filter((e) => e.essential);
  // Use yearly total as source of truth (no precision loss from /12 rounding)
  const yearlyEssentialCents = essentialExpenses.reduce(
    (sum, e) => sum + getDisplayAmountCents(e, "yearly"),
    0,
  );
  const monthlyEssentialCents = roundToUnit(yearlyEssentialCents / 12);
  const targetCents = roundToUnit((yearlyEssentialCents / 12) * selectedMonths);

  return (
    <ScreenWrapper>
      <Text className="mb-6 text-3xl font-bold text-gray-900">Emergency</Text>

      {loading ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
        <View>
          <Text className="mb-1 text-sm font-medium text-gray-500">
            Monthly essential expenses
          </Text>
          <CurrencyText
            cents={monthlyEssentialCents}
            className="mb-6 text-2xl font-bold text-gray-900"
            suffixFormat
          />

          <Text className="mb-2 text-sm font-medium text-gray-500">
            Time period
          </Text>
          <Slider
            testID="slider"
            minimumValue={0}
            maximumValue={SNAP_POINTS.length - 1}
            step={1}
            value={SNAP_POINTS.indexOf(selectedMonths)}
            onValueChange={(i) => setSelectedMonths(SNAP_POINTS[i])}
            minimumTrackTintColor="#818cf8"
            maximumTrackTintColor="#e5e7eb"
            thumbTintColor="#818cf8"
          />
          <Text className="mt-1 text-center text-base font-semibold text-gray-700">
            {formatPeriod(selectedMonths)}
          </Text>

          <View className="mt-6 rounded-2xl bg-white p-5">
            <Text className="mb-1 text-sm font-medium text-gray-500">
              Emergency fund target
            </Text>
            <CurrencyText
              cents={targetCents}
              className="text-3xl font-bold text-fixo-500"
              suffixFormat
            />
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
