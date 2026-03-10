import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Slider from "@react-native-community/slider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  sumDisplayCents,
  roundToUnit,
  getDisplayAmountCents,
} from "../../../types/firestore";
import type { Expense } from "../../../types/firestore";
import { getCurrencySymbol } from "../../../constants/banks";
import { colors } from "../../../constants/colors";
import {
  BottomSheet,
  Card,
  EmptyState,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";
import { CurrencyText } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useData } from "../../../contexts/DataContext";

const SNAP_POINTS: number[] = [3, 6, 12, 18, 24, 36, 48, 60];

const PRIORITY_COLOR: Record<string, string> = {
  essential: "text-amber-500",
  reducible: "text-blue-500",
};

function useFormatPeriod() {
  const { t } = useTranslation();
  return (months: number): string => {
    if (months < 12) return t("emergency.months", { count: months });
    const years = months / 12;
    if (Number.isInteger(years)) return t("emergency.years", { count: years });
    return t("emergency.months", { count: months });
  };
}

export default function EmergencyFundScreen() {
  const { t } = useTranslation();
  const formatPeriod = useFormatPeriod();
  const { expenses, loading } = useExpenses();
  const {
    emergencyMonths,
    setEmergencyMonths: saveEmergencyMonths,
    wallets,
    currency,
  } = useData();

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

  const detailSheetRef = useRef<BottomSheetModal>(null);

  const walletNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const w of wallets) map[w.id] = w.name;
    return map;
  }, [wallets]);

  const priorityLabel = useMemo<Record<string, string>>(
    () => ({
      essential: t("home.essential"),
      reducible: t("home.reducible"),
    }),
    [t],
  );

  const renderExpenseRow = useCallback(
    ({ item }: { item: Expense }) => {
      const displayCents = getDisplayAmountCents(item, "monthly");
      return (
        <View className="flex-row items-center justify-between py-3">
          <View className="mr-4 flex-1">
            <Text className="text-base font-semibold text-gray-900">
              {item.name}
            </Text>
            <View className="mt-0.5 flex-row items-center">
              <Text className="text-sm text-gray-500">
                {walletNameMap[item.walletId] ?? "\u2014"}
              </Text>
              <Text className="mx-2 text-sm text-gray-400">•</Text>
              <Text
                className={`text-sm font-medium ${PRIORITY_COLOR[item.priority] ?? "text-gray-400"}`}
              >
                {priorityLabel[item.priority] ?? item.priority}
              </Text>
            </View>
          </View>
          <CurrencyText
            cents={displayCents}
            className="text-base font-semibold text-gray-900"
          />
        </View>
      );
    },
    [walletNameMap, priorityLabel],
  );

  const essentialExpenses = expenses.filter((e) => e.priority !== "optional");
  const yearlyEssentialCents = sumDisplayCents(essentialExpenses, "yearly");
  const monthlyEssentialCents = roundToUnit(yearlyEssentialCents / 12);
  const targetCents = roundToUnit((yearlyEssentialCents / 12) * selectedMonths);

  const headerContent = (
    <Text className="mb-3 text-sm text-gray-500">
      {t("emergency.description")}
    </Text>
  );

  return (
    <ScreenWrapper title={t("emergency.title")} header={headerContent} scroll>
      {loading ? (
        <ActivityIndicator color={colors.fixo[400]} className="mt-8" />
      ) : essentialExpenses.length === 0 ? (
        <EmptyState
          icon="shield-outline"
          message={t("emergency.noEssential")}
        />
      ) : (
        <View className="gap-4 pb-4">
          {/* Essentials Summary */}
          <Card>
            <View className="flex-row items-center">
              <Pressable
                className="flex-1 items-center"
                onPress={() => detailSheetRef.current?.present()}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl font-bold text-gray-900">
                    {essentialExpenses.length}
                  </Text>
                  <Ionicons
                    name="information-circle-outline"
                    size={16}
                    color="#9ca3af"
                    style={{ marginLeft: 4 }}
                  />
                </View>
                <Text className="text-xs font-medium text-gray-400">
                  {t("emergency.essentialExpenses")}
                </Text>
              </Pressable>
              <View className="w-px self-stretch bg-gray-200" />
              <View className="flex-1 items-center">
                <CurrencyText
                  cents={monthlyEssentialCents}
                  className="text-2xl font-bold text-gray-900"
                  suffixFormat
                />
                <Text className="text-xs text-gray-400">
                  {t("emergency.monthlyCost")}
                </Text>
              </View>
            </View>
          </Card>

          {/* Coverage Period + Target (unified) */}
          <View>
            <SectionHeader title={t("emergency.yourTarget")} />
            <Card>
              <Slider
                testID="slider"
                minimumValue={0}
                maximumValue={SNAP_POINTS.length - 1}
                step={1}
                value={SNAP_POINTS.indexOf(selectedMonths)}
                onValueChange={(i) => setSelectedMonths(SNAP_POINTS[i])}
                onSlidingComplete={handleSlidingComplete}
                minimumTrackTintColor={colors.fixo[400]}
                maximumTrackTintColor="#e5e7eb"
                thumbTintColor={colors.fixo[400]}
              />
              <Text className="mt-1 text-center text-xl font-bold text-gray-900">
                {formatPeriod(selectedMonths)}
              </Text>
              <CurrencyText
                cents={targetCents}
                className="mt-3 text-center text-3xl font-bold text-fixo-500"
                suffixFormat
              />
              <Text className="mt-2 text-center text-xs text-gray-400">
                {t("emergency.targetDetail", {
                  count: essentialExpenses.length,
                  monthlyCost: `${getCurrencySymbol(currency)}${(monthlyEssentialCents / 100).toFixed(0)}`,
                  months: selectedMonths,
                })}
              </Text>
            </Card>
          </View>

          {/* Recommendation Tip */}
          <View className="flex-row rounded-xl bg-fixo-50 p-4">
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.fixo[400]}
              style={{ marginRight: 8, marginTop: 2 }}
            />
            <Text className="flex-1 text-sm leading-5 text-gray-600">
              {t("emergency.recommendation")}
            </Text>
          </View>
        </View>
      )}
      <BottomSheet ref={detailSheetRef} snapPoints={["50%"]}>
        <Text className="mb-3 text-sm text-gray-400">
          {t("emergency.coveredDescription")}
        </Text>
        <View>
          {essentialExpenses.map((item, index) => (
            <View key={item.id}>
              {index > 0 && <View className="h-px bg-gray-100" />}
              {renderExpenseRow({ item })}
            </View>
          ))}
        </View>
      </BottomSheet>
    </ScreenWrapper>
  );
}
