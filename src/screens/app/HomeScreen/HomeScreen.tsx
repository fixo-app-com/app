import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useData } from "../../../contexts/DataContext";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import type { PinnedBudgetMetric } from "../../../types/firestore";
import type { ViewMode } from "../../../contexts/DataContext";
import {
  Card,
  ChipGroup,
  EmptyState,
  FullScreenLoader,
  ScreenWrapper,
} from "../../../design-system";
import {
  CategoryCard,
  CurrencyText,
  FloatingAction,
} from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";

type Nav = NativeStackNavigationProp<HomeStackParamList, "Home">;

/* ---------- Metric helpers ---------- */

type MetricDef = {
  key: PinnedBudgetMetric;
  label: string;
  cents: number;
  colorClass: string;
};

function buildMetrics(
  budgetDisplayCents: number,
  totalCents: number,
  availableCents: number,
  isYearly: boolean,
): MetricDef[] {
  return [
    {
      key: "budget",
      label: isYearly ? "Yearly budget" : "Monthly budget",
      cents: budgetDisplayCents,
      colorClass: "text-gray-900",
    },
    {
      key: "costs",
      label: "Total costs",
      cents: totalCents,
      colorClass: "text-red-500",
    },
    {
      key: "available",
      label: "Leftover",
      cents: availableCents,
      colorClass: availableCents >= 0 ? "text-emerald-600" : "text-red-500",
    },
  ];
}

/* ---------- Slide Content Wrapper ---------- */

const SLIDE_MIN_HEIGHT = 125;

function SlideContent({ children }: { children: React.ReactNode }) {
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

/* ---------- Budget Card ---------- */

function BudgetCard({
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
  if (!hasBudget) {
    return (
      <Card>
        <Pressable
          onPress={onBudgetEdit}
          className="flex-row items-center justify-center py-2"
        >
          <Text className="text-sm font-medium text-gray-500">
            {isYearly ? "Set yearly budget" : "Set monthly budget"}
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

  const metrics = buildMetrics(
    budgetDisplayCents,
    totalCents,
    availableCents,
    isYearly,
  );
  const hero = metrics.find((m) => m.key === pinnedMetric) ?? metrics[0];
  const secondary = metrics.filter((m) => m.key !== pinnedMetric);

  const isHeroBudget = hero.key === "budget";

  return (
    <Card>
      <SlideContent>
        {/* Hero metric */}
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

        {/* Secondary metrics row — tap always pins */}
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

/* ---------- Budget Chart Card ---------- */

function BudgetChartCard({
  isYearly,
  budgetDisplayCents,
  totalCents,
  availableCents,
}: {
  isYearly: boolean;
  budgetDisplayCents: number;
  totalCents: number;
  availableCents: number;
}) {
  const ratio = budgetDisplayCents > 0 ? totalCents / budgetDisplayCents : 0;
  const pct = Math.round(ratio * 100);
  const barWidth = Math.min(pct, 100);
  const barColor =
    pct <= 50 ? "bg-emerald-500" : pct <= 80 ? "bg-yellow-400" : "bg-red-500";

  return (
    <Card testID="budget-chart-card">
      <SlideContent>
        {/* Header: budget label + amount */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {isYearly ? "Yearly budget" : "Monthly budget"}
          </Text>
          <CurrencyText
            cents={budgetDisplayCents}
            className="text-sm font-semibold text-gray-900"
            hideDecimals
          />
        </View>

        {/* Progress bar + percentage */}
        <View>
          <View className="h-4 overflow-hidden rounded-full bg-gray-200">
            <View
              className={`h-4 rounded-full ${barColor}`}
              style={{ width: `${barWidth}%` }}
              testID="budget-bar-fill"
            />
          </View>
          <Text className="mt-2 text-center text-sm font-semibold text-gray-700">
            {pct}% used
          </Text>
        </View>

        {/* Costs / Leftover row */}
        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs font-medium text-gray-400">
              Total costs
            </Text>
            <CurrencyText
              cents={totalCents}
              className="mt-0.5 text-sm font-semibold text-red-500"
              hideDecimals
            />
          </View>
          <View className="items-end">
            <Text className="text-xs font-medium text-gray-400">Leftover</Text>
            <CurrencyText
              cents={availableCents}
              className={`mt-0.5 text-sm font-semibold ${availableCents >= 0 ? "text-emerald-600" : "text-red-500"}`}
              hideDecimals
            />
          </View>
        </View>
      </SlideContent>
    </Card>
  );
}

/* ---------- Dot Indicators ---------- */

function DotIndicators({ count, active }: { count: number; active: number }) {
  return (
    <View
      className="mt-2 flex-row items-center justify-center gap-2"
      testID="dot-indicators"
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className={`h-2 w-2 rounded-full ${i === active ? "bg-gray-800" : "bg-gray-300"}`}
        />
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const {
    categories,
    monthlyBudgetCents,
    setMonthlyBudget,
    viewMode,
    setViewMode,
    isLoading: dataLoading,
    pinnedBudgetMetric,
    setPinnedBudgetMetric,
  } = useData();

  const { expenses, loading: loadingExpenses } = useExpenses();

  const isYearly = viewMode === "yearly";

  function getCategoryTotal(categoryId: string): number {
    return roundToUnit(
      expenses
        .filter((e) => e.categoryId === categoryId)
        .reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
    );
  }

  function getCategoryCount(categoryId: string): number {
    return expenses.filter((e) => e.categoryId === categoryId).length;
  }

  const rawTotalCents = expenses.reduce(
    (sum, e) => sum + getDisplayAmountCents(e, viewMode),
    0,
  );
  const totalCents = roundToUnit(rawTotalCents);
  const budgetDisplayCents = isYearly
    ? monthlyBudgetCents * 12
    : monthlyBudgetCents;
  const availableCents = budgetDisplayCents - rawTotalCents;
  const hasBudget = monthlyBudgetCents > 0;

  function handleBudgetEdit() {
    const displayCents = isYearly
      ? monthlyBudgetCents * 12
      : monthlyBudgetCents;
    const current = hasBudget ? String(Math.floor(displayCents / 100)) : "";
    const label = isYearly ? "Yearly budget" : "Monthly budget";
    Alert.prompt(
      label,
      `Enter your total ${isYearly ? "yearly" : "monthly"} budget`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: (value?: string) => {
            const parsed = parseFloat((value ?? "").replace(",", "."));
            if (!isNaN(parsed) && parsed >= 0) {
              const cents = Math.round(parsed * 100);
              setMonthlyBudget(isYearly ? Math.ceil(cents / 12) : cents);
            }
          },
        },
      ],
      "plain-text",
      current,
      "number-pad",
    );
  }

  const { width: screenWidth } = useWindowDimensions();
  const pageWidth = screenWidth; // each page = full screen width
  const [activePage, setActivePage] = useState(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
      setActivePage(page);
    },
    [pageWidth],
  );

  if (dataLoading) {
    return <FullScreenLoader />;
  }

  const headerContent = (
    <>
      <Text className="mb-4 text-3xl font-bold text-gray-900">Home</Text>

      {/* Monthly / Yearly toggle */}
      <ChipGroup
        options={[
          { value: "monthly" as ViewMode, label: "Monthly" },
          { value: "yearly" as ViewMode, label: "Yearly" },
        ]}
        selected={viewMode}
        onSelect={setViewMode}
        compact
      />

      {hasBudget ? (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            style={{ marginHorizontal: -16, marginBottom: 2 }}
            testID="budget-slider"
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: pageWidth, paddingHorizontal: 16 }}>
                <BudgetCard
                  hasBudget={hasBudget}
                  isYearly={isYearly}
                  budgetDisplayCents={budgetDisplayCents}
                  totalCents={totalCents}
                  availableCents={availableCents}
                  pinnedMetric={pinnedBudgetMetric}
                  onPin={setPinnedBudgetMetric}
                  onBudgetEdit={handleBudgetEdit}
                />
              </View>
              <View style={{ width: pageWidth, paddingHorizontal: 16 }}>
                <BudgetChartCard
                  isYearly={isYearly}
                  budgetDisplayCents={budgetDisplayCents}
                  totalCents={totalCents}
                  availableCents={availableCents}
                />
              </View>
            </View>
          </ScrollView>
          <View className="mb-2">
            <DotIndicators count={2} active={activePage} />
          </View>
        </>
      ) : (
        <BudgetCard
          hasBudget={hasBudget}
          isYearly={isYearly}
          budgetDisplayCents={budgetDisplayCents}
          totalCents={totalCents}
          availableCents={availableCents}
          pinnedMetric={pinnedBudgetMetric}
          onPin={setPinnedBudgetMetric}
          onBudgetEdit={handleBudgetEdit}
        />
      )}

      <View className="mb-2" />
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      {loadingExpenses ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <CategoryCard
              icon={item.icon}
              name={item.name}
              expenseCount={getCategoryCount(item.id)}
              totalCents={getCategoryTotal(item.id)}
              onPress={() =>
                navigation.navigate("CategoryDetail", {
                  categoryId: item.id,
                  categoryName: item.name,
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <EmptyState icon="grid-outline" message="No categories yet." />
          }
        />
      )}

      <FloatingAction
        label="Add category"
        onPress={() => navigation.navigate("AddEditCategory", {})}
      />
    </ScreenWrapper>
  );
}
