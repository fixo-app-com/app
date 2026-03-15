import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import DraggableFlatList, {
  OpacityDecorator,
} from "react-native-draggable-flatlist";
import type { RenderItemParams } from "react-native-draggable-flatlist";
import { useData } from "../../../contexts/DataContext";
import type {
  ExpensePriority,
  PinnedBudgetMetric,
} from "../../../types/firestore";
import {
  BottomSheet,
  ScreenWrapper,
  SectionHeader,
  useScrollHeader,
} from "../../../design-system";
import { LIST_BOTTOM_PADDING, WIDGET_GAP } from "../../../constants/layout";
import { ViewModeToggle } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useBudgetSummary } from "../../../hooks/useBudgetSummary";
import type { AppRootStackParamList } from "../../../navigation/RootNavigator";
import { BudgetCard } from "./BudgetCard";
import { DonutChart } from "./DonutChart";
import { TopExpensesCard } from "./TopExpensesCard";
import { WalletBreakdownCard } from "./WalletBreakdownCard";
import { EssentialSplitCard } from "./EssentialSplitCard";
import { PriorityExpensesSheet } from "./PriorityExpensesSheet";
import { FixedCostRatioCard } from "./FixedCostRatioCard";
import { DailyBudgetCard } from "./DailyBudgetCard";
import { EmergencyFundMiniCard } from "./EmergencyFundMiniCard";
import { GettingStartedCards } from "./GettingStartedCards";
import { useWidgetOrder } from "./useWidgetOrder";
import { HomeScreenSkeleton } from "./HomeScreenSkeleton";
import type { WidgetKey } from "./types";

const METRIC_EXPLAINER_KEYS: Record<string, string> = {
  costs: "home.costsExplainer",
  available: "home.availableExplainer",
};

type WidgetItem = { key: WidgetKey };

const ItemSeparator = () => <View style={{ height: WIDGET_GAP }} />;

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<AppRootStackParamList>>();
  const {
    categories,
    wallets,
    monthlyIncomeCents,
    emergencyMonths,
    setMonthlyIncome,
    viewMode,
    setViewMode,
    isLoading: dataLoading,
  } = useData();

  const { expenses, loading: expensesLoading } = useExpenses();
  const { order, saveOrder } = useWidgetOrder();

  const budget = useBudgetSummary({
    expenses,
    categories,
    wallets,
    monthlyIncomeCents,
    viewMode,
    emergencyMonths,
  });

  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const [selectedPriority, setSelectedPriority] =
    useState<ExpensePriority>("essential");
  const prioritySheetRef = useRef<BottomSheetModal>(null);
  const reopenPrioritySheet = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (reopenPrioritySheet.current) {
        reopenPrioritySheet.current = false;
        requestAnimationFrame(() => prioritySheetRef.current?.present());
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Metric info bottom sheet
  const metricInfoSheetRef = useRef<BottomSheetModal>(null);
  const [metricInfoContent, setMetricInfoContent] = useState({
    title: "",
    body: "",
  });

  // Pinned budget metric (persisted to AsyncStorage)
  const [pinnedBudgetMetric, setPinnedBudgetMetricRaw] =
    useState<PinnedBudgetMetric>("income");

  useEffect(() => {
    AsyncStorage.getItem("@fixo/pinned_metric").then((v) => {
      if (v === "income" || v === "costs" || v === "available") {
        setPinnedBudgetMetricRaw(v);
      }
    });
  }, []);

  const setPinnedBudgetMetric = useCallback((m: PinnedBudgetMetric) => {
    setPinnedBudgetMetricRaw(m);
    AsyncStorage.setItem("@fixo/pinned_metric", m);
  }, []);

  // Collapsing header: own scrollY driven by DraggableFlatList's onScrollOffsetChange
  const ownScrollY = useRef(new Animated.Value(0)).current;
  const { scrollY, largeTitleOpacity, contentTopPadding } =
    useScrollHeader(ownScrollY);

  const handleScrollOffset = useCallback(
    (offset: number) => {
      scrollY.setValue(offset);
    },
    [scrollY],
  );

  function handleMetricInfo(metric: PinnedBudgetMetric) {
    const key = METRIC_EXPLAINER_KEYS[metric];
    if (!key) return;
    const labels: Record<string, string> = {
      costs: t("home.totalCosts"),
      available: t("home.available"),
    };
    setMetricInfoContent({
      title: labels[metric] ?? "",
      body: t(key as never),
    });
    metricInfoSheetRef.current?.present();
  }

  function handlePriorityPress(priority: ExpensePriority) {
    setSelectedPriority(priority);
    prioritySheetRef.current?.present();
  }

  const isYearly = viewMode === "yearly";
  const hasIncome = monthlyIncomeCents > 0;

  function handleIncomeEdit() {
    const current = hasIncome
      ? String(Math.floor(budget.incomeDisplayCents / 100))
      : "";
    const label = isYearly ? t("home.yearlyIncome") : t("home.monthlyIncome");
    const period = isYearly
      ? t("common.yearly").toLowerCase()
      : t("common.monthly").toLowerCase();
    Alert.prompt(
      label,
      t("home.enterIncome", { period }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.save"),
          onPress: (value?: string) => {
            const trimmed = (value ?? "").trim();
            if (trimmed === "" || trimmed === "0") {
              setMonthlyIncome(0);
              return;
            }
            const parsed = parseFloat(trimmed.replace(",", "."));
            if (!isNaN(parsed) && parsed >= 0) {
              const cents = Math.round(parsed * 100);
              const monthlyCents = isYearly ? Math.ceil(cents / 12) : cents;
              setMonthlyIncome(monthlyCents);
            }
          },
        },
      ],
      "plain-text",
      current,
      "number-pad",
    );
  }

  // Widget registry: maps each key to visibility + render function
  const registry: Record<
    WidgetKey,
    { isVisible: boolean; render: () => React.ReactNode }
  > = {
    overview: {
      isVisible: true,
      render: () => (
        <View>
          <SectionHeader title={t("home.overview")} />
          <BudgetCard
            hasIncome={hasIncome}
            isYearly={isYearly}
            incomeDisplayCents={budget.incomeDisplayCents}
            totalCents={budget.totalCents}
            availableCents={budget.availableCents}
            pinnedMetric={pinnedBudgetMetric}
            onPin={setPinnedBudgetMetric}
            onIncomeEdit={handleIncomeEdit}
            onMetricInfo={handleMetricInfo}
          />
        </View>
      ),
    },
    gettingStarted: {
      isVisible:
        categories.length === 0 ||
        expenses.length === 0 ||
        wallets.length === 0,
      render: () => (
        <GettingStartedCards
          categories={categories}
          expenses={expenses}
          wallets={wallets}
          navigation={navigation}
        />
      ),
    },
    fixedCosts: {
      isVisible: hasIncome && expenses.length > 0,
      render: () => (
        <FixedCostRatioCard
          totalCents={budget.totalCents}
          incomeDisplayCents={budget.incomeDisplayCents}
        />
      ),
    },
    dailyBudget: {
      isVisible: hasIncome && expenses.length > 0,
      render: () => (
        <DailyBudgetCard
          availableCents={budget.availableCents}
          incomeDisplayCents={budget.incomeDisplayCents}
          isYearly={isYearly}
        />
      ),
    },
    emergencyFund: {
      isVisible: hasIncome,
      render: () => (
        <EmergencyFundMiniCard
          essentialExpenses={budget.essentialExpenses}
          targetCents={budget.emergencyTargetCents}
          availableMonthlyCents={budget.availableMonthlyCents}
          onPress={() =>
            navigation.navigate("MainTabs", { screen: "EmergencyTab" })
          }
        />
      ),
    },
    breakdown: {
      isVisible: budget.donutSegments.length > 0,
      render: () => (
        <View>
          <SectionHeader title={t("home.breakdown")} />
          <DonutChart
            segments={budget.donutSegments}
            totalCents={budget.totalCents}
            allLabel={t("home.allCategories")}
          />
        </View>
      ),
    },
    topExpenses: {
      isVisible: true,
      render: () => <TopExpensesCard expenses={expenses} viewMode={viewMode} />,
    },
    wallets: {
      isVisible: budget.walletSpend.length > 0,
      render: () => <WalletBreakdownCard walletSpend={budget.walletSpend} />,
    },
    essentialSplit: {
      isVisible: expenses.length > 0,
      render: () => (
        <EssentialSplitCard
          essentialCents={budget.essentialCents}
          reducibleCents={budget.reducibleCents}
          optionalCents={budget.optionalCents}
          onPriorityPress={handlePriorityPress}
        />
      ),
    },
  };

  // Build visible items from user's saved order (overview excluded — rendered in header)
  const visibleItems: WidgetItem[] = useMemo(
    () =>
      order
        .filter((key) => key !== "overview" && registry[key].isVisible)
        .map((key) => ({ key })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, hasIncome, expenses.length, budget],
  );

  const handleDragEnd = useCallback(
    ({ data }: { data: WidgetItem[] }) => {
      const reordered = data.map((d) => d.key);

      // Rebuild full order: overview first, then reordered visible, then hidden
      const visibleSet = new Set(reordered);
      const hidden = order.filter(
        (k) => k !== "overview" && !visibleSet.has(k),
      );
      saveOrder(["overview", ...reordered, ...hidden]);
    },
    [order, saveOrder],
  );

  const renderWidget = useCallback(
    ({ item, drag, isActive }: RenderItemParams<WidgetItem>) => {
      return (
        <OpacityDecorator activeOpacity={0.6}>
          <Pressable
            onLongPress={drag}
            delayLongPress={200}
            style={isActive ? { opacity: 0.6 } : undefined}
          >
            {registry[item.key].render()}
          </Pressable>
        </OpacityDecorator>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasIncome, isYearly, pinnedBudgetMetric, expenses, viewMode, budget],
  );

  const keyExtractor = useCallback((item: WidgetItem) => item.key, []);

  const listHeader = (
    <>
      <Animated.View style={{ opacity: largeTitleOpacity }}>
        <Text className="mb-2 text-3xl font-bold text-gray-900">
          {t("home.title")}
        </Text>
      </Animated.View>
      <View className="mb-4">
        <ViewModeToggle selected={viewMode} onSelect={setViewMode} />
      </View>
      {registry.overview.isVisible && (
        <View style={{ marginBottom: WIDGET_GAP }}>
          {registry.overview.render()}
        </View>
      )}
    </>
  );

  const showSkeleton =
    !minTimeElapsed ||
    dataLoading ||
    (expensesLoading && expenses.length === 0);

  if (showSkeleton) {
    return <HomeScreenSkeleton />;
  }

  return (
    <>
      <ScreenWrapper title={t("home.title")} scrollY={scrollY}>
        <DraggableFlatList
          data={visibleItems}
          keyExtractor={keyExtractor}
          renderItem={renderWidget}
          onDragEnd={handleDragEnd}
          onScrollOffsetChange={handleScrollOffset}
          ListHeaderComponent={listHeader}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: contentTopPadding,
            paddingBottom: LIST_BOTTOM_PADDING,
          }}
        />
      </ScreenWrapper>
      <PriorityExpensesSheet
        ref={prioritySheetRef}
        priority={selectedPriority}
        onExpensePress={(expense) => {
          reopenPrioritySheet.current = true;
          prioritySheetRef.current?.dismiss();
          navigation.navigate("AddEditExpense", {
            categoryId: expense.categoryId,
            expenseId: expense.id,
          });
        }}
      />
      <BottomSheet ref={metricInfoSheetRef} title={metricInfoContent.title}>
        <Text className="text-sm leading-6 text-gray-600">
          {metricInfoContent.body}
        </Text>
      </BottomSheet>
    </>
  );
}
