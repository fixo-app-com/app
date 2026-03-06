import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import type { Category } from "../../../types/firestore";
import {
  EmptyState,
  FloatingAction,
  FullScreenLoader,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import {
  CategoryCard,
  ViewModeToggle,
} from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortSheet } from "../../../hooks/useSortSheet";
import { makeSortComparator } from "../../../utils/sort";
import { BudgetCard } from "./BudgetCard";
import { BudgetChartCard } from "./BudgetChartCard";
import { DotIndicators } from "./DotIndicators";

type Nav = NativeStackNavigationProp<HomeStackParamList, "Home">;

export default function HomeScreen() {
  const { t } = useTranslation();
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
  const sort = useSortSheet("categories");

  const sortedCategories = useMemo(() => {
    const comparator = makeSortComparator<Category>(
      sort.selected,
      (c) => getCategoryTotal(c.id),
      (c) => c.createdAt,
    );
    return [...categories].sort(comparator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, sort.selected, expenses, viewMode]);

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
    const label = isYearly ? t("home.yearlyBudget") : t("home.monthlyBudget");
    const period = isYearly ? t("common.yearly").toLowerCase() : t("common.monthly").toLowerCase();
    Alert.prompt(
      label,
      t("home.enterBudget", { period }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.save"),
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
  const pageWidth = screenWidth;
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
      <Text className="mb-4 text-3xl font-bold text-gray-900">{t("home.title")}</Text>

      <ViewModeToggle selected={viewMode} onSelect={setViewMode} />

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

      <View className="mb-2 flex-row justify-end">
        <SortTrigger label={sort.triggerLabel} onPress={sort.open} />
      </View>
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      {loadingExpenses ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
        <FlatList
          data={sortedCategories}
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
            <EmptyState icon="grid-outline" message={t("home.noCategories")} />
          }
        />
      )}

      <FloatingAction
        label={t("home.addCategory")}
        onPress={() => navigation.navigate("AddEditCategory", {})}
      />

      <SortBottomSheet
        visible={sort.isOpen}
        title={sort.title}
        options={sort.options}
        selected={sort.selected}
        onSelect={sort.select}
        onClose={sort.close}
      />
    </ScreenWrapper>
  );
}
