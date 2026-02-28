import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import {
  getDisplayAmountCents,
  roundToUnit,
  type Expense,
} from "../../../types/firestore";
import { ScreenWrapper } from "../../../design-system";
import { getCurrencySymbol } from "../../../constants/banks";

const SNAP_POINTS: number[] = [3, 6, 12, 18, 24, 36, 48, 60];

function snapToNearest(value: number): number {
  let closest = SNAP_POINTS[0];
  let minDist = Math.abs(value - closest);
  for (let i = 1; i < SNAP_POINTS.length; i++) {
    const dist = Math.abs(value - SNAP_POINTS[i]);
    if (dist < minDist) {
      minDist = dist;
      closest = SNAP_POINTS[i];
    }
  }
  return closest;
}

function formatPeriod(months: number): string {
  if (months < 12) return `${months} months`;
  const years = months / 12;
  const yStr = Number.isInteger(years) ? `${years}` : years.toFixed(1);
  return `${yStr} ${years === 1 ? "year" : "years"}`;
}

export default function EmergencyFundScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { currency } = useData();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonths, setSelectedMonths] = useState(6);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getExpenses(user.uid);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchExpenses();
    });
    return unsubscribe;
  }, [navigation, fetchExpenses]);

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
          <Text className="mb-6 text-2xl font-bold text-gray-900">
            {Math.floor(monthlyEssentialCents / 100).toLocaleString("de-DE")}{" "}
            {getCurrencySymbol(currency)}
          </Text>

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
            <Text className="text-3xl font-bold text-fixo-500">
              {Math.floor(targetCents / 100).toLocaleString("de-DE")}{" "}
              {getCurrencySymbol(currency)}
            </Text>
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
}
