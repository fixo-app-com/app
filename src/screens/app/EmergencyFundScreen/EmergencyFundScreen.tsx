import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getDisplayAmountCents, roundToUnit } from "../../../types/firestore";
import {
  Card,
  EmptyState,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";
import { CurrencyText } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useData } from "../../../contexts/DataContext";

const SNAP_POINTS: number[] = [3, 6, 12, 18, 24, 36, 48, 60];

function formatPeriod(months: number): string {
  if (months < 12) return `${months} months`;
  const years = months / 12;
  const yStr = Number.isInteger(years) ? `${years}` : years.toFixed(1);
  return `${yStr} ${years === 1 ? "year" : "years"}`;
}

export default function EmergencyFundScreen() {
  const { expenses, loading } = useExpenses();
  const { emergencyMonths, setEmergencyMonths: saveEmergencyMonths } =
    useData();

  const [selectedMonths, setSelectedMonths] = useState(emergencyMonths);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from context on mount
  useEffect(() => {
    setSelectedMonths(emergencyMonths);
  }, [emergencyMonths]);

  const handleSlidingComplete = useCallback(
    (index: number) => {
      const months = SNAP_POINTS[index];
      setSelectedMonths(months);

      // Debounce save
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        saveEmergencyMonths(months);
      }, 150);
    },
    [saveEmergencyMonths],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const essentialExpenses = expenses.filter((e) => e.essential);
  const yearlyEssentialCents = essentialExpenses.reduce(
    (sum, e) => sum + getDisplayAmountCents(e, "yearly"),
    0,
  );
  const monthlyEssentialCents = roundToUnit(yearlyEssentialCents / 12);
  const targetCents = roundToUnit((yearlyEssentialCents / 12) * selectedMonths);

  const headerContent = (
    <View>
      <Text className="text-3xl font-bold text-gray-900 mb-3">
        Emergency fund
      </Text>
      <Text className="mb-4 mt-1 text-sm text-gray-500">
        Simulate how much cash you need to cover your essential expenses if your
        income stops.
      </Text>
    </View>
  );

  return (
    <ScreenWrapper header={headerContent} scroll>
      {loading ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : essentialExpenses.length === 0 ? (
        <EmptyState
          icon="shield-outline"
          message="No essential expenses yet. Mark an expense as essential to start calculating your emergency fund."
        />
      ) : (
        <View className="gap-4 pb-8">
          {/* Essentials Summary */}
          <Card>
            <View className="flex-row items-center">
              <View className="flex-1 items-center">
                <Text className="text-2xl font-bold text-gray-900">
                  {essentialExpenses.length}
                </Text>
                <Text className="text-xs text-gray-400">Expenses</Text>
              </View>
              <View className="w-px self-stretch bg-gray-200" />
              <View className="flex-1 items-center">
                <CurrencyText
                  cents={monthlyEssentialCents}
                  className="text-2xl font-bold text-gray-900"
                  suffixFormat
                />
                <Text className="text-xs text-gray-400">Monthly cost</Text>
              </View>
            </View>
          </Card>

          {/* Coverage Period */}
          <View>
            <SectionHeader title="Coverage period" />
            <Card>
              <Slider
                testID="slider"
                minimumValue={0}
                maximumValue={SNAP_POINTS.length - 1}
                step={1}
                value={SNAP_POINTS.indexOf(selectedMonths)}
                onValueChange={(i) => setSelectedMonths(SNAP_POINTS[i])}
                onSlidingComplete={handleSlidingComplete}
                minimumTrackTintColor="#818cf8"
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor="#818cf8"
              />
              <Text className="mt-1 text-center text-xl font-bold text-gray-900">
                {formatPeriod(selectedMonths)}
              </Text>
              <Text className="mt-1 text-center text-xs text-gray-400">
                Drag to adjust
              </Text>
            </Card>
          </View>

          {/* Target Card */}
          <View>
            <SectionHeader title="Your target" />
            <Card>
              <CurrencyText
                cents={targetCents}
                className="text-center text-3xl font-bold text-fixo-500"
                suffixFormat
              />
              <Text className="mt-1 text-center text-sm text-gray-500">
                {formatPeriod(selectedMonths)} of essential expenses
              </Text>
              <Text className="mt-2 text-center text-xs text-gray-400">
                {essentialExpenses.length} expenses · €
                {(monthlyEssentialCents / 100).toFixed(0)}/mo × {selectedMonths}{" "}
                mo
              </Text>
            </Card>
          </View>

          {/* Recommendation Tip */}
          <View className="flex-row rounded-xl bg-fixo-50 p-4">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#818cf8"
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <Text className="flex-1 text-sm leading-5 text-gray-600">
              Most financial advisors recommend saving 3 to 6 months of
              essential expenses. Adjust based on your job stability and
              personal comfort.
            </Text>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
