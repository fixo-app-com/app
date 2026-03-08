import { useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useData } from "../../../contexts/DataContext";
import {
  roundToUnit,
  getDisplayAmountCents,
  sumDisplayCents,
} from "../../../types/firestore";
import type { ExpensePriority, PinnedBudgetMetric } from "../../../types/firestore";
import {
  BottomSheet,
  FullScreenLoader,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";
import { ViewModeToggle } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { BudgetCard } from "./BudgetCard";
import { DonutChart } from "./DonutChart";
import type { DonutSegment } from "./DonutChart";
import { TopExpensesCard } from "./TopExpensesCard";
import { WalletBreakdownCard } from "./WalletBreakdownCard";
import { EssentialSplitCard } from "./EssentialSplitCard";
import { PriorityExpensesSheet } from "./PriorityExpensesSheet";

const METRIC_EXPLAINER_KEYS: Record<string, string> = {
  costs: "home.costsExplainer",
  available: "home.availableExplainer",
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const {
    categories,
    wallets,
    monthlyIncomeCents,
    setMonthlyIncome,
    viewMode,
    setViewMode,
    isLoading: dataLoading,
  } = useData();

  const { expenses } = useExpenses();

  const [selectedPriority, setSelectedPriority] =
    useState<ExpensePriority>("essential");
  const prioritySheetRef = useRef<BottomSheetModal>(null);

  // Metric info bottom sheet
  const metricInfoSheetRef = useRef<BottomSheetModal>(null);
  const [metricInfoContent, setMetricInfoContent] = useState({ title: "", body: "" });

  // Pinned budget metric (local state — no longer persisted)
  const [pinnedBudgetMetric, setPinnedBudgetMetric] =
    useState<PinnedBudgetMetric>("income");

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

  const rawTotalCents = sumDisplayCents(expenses, viewMode);
  const totalCents = roundToUnit(rawTotalCents);
  const incomeDisplayCents = isYearly
    ? monthlyIncomeCents * 12
    : monthlyIncomeCents;
  const availableCents = incomeDisplayCents - rawTotalCents;
  const hasIncome = monthlyIncomeCents > 0;

  function handleIncomeEdit() {
    const displayCents = isYearly
      ? monthlyIncomeCents * 12
      : monthlyIncomeCents;
    const current = hasIncome ? String(Math.floor(displayCents / 100)) : "";
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

  const donutSegments: DonutSegment[] = categories
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      totalCents: roundToUnit(
        expenses
          .filter((e) => e.categoryId === cat.id)
          .reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
      ),
    }))
    .filter((s) => s.totalCents > 0);

  const donutTotal = donutSegments.reduce((sum, s) => sum + s.totalCents, 0);

  if (dataLoading) {
    return <FullScreenLoader />;
  }

  const headerContent = (
    <>
      <Text className="mb-4 text-3xl font-bold text-gray-900">
        {t("home.title")}
      </Text>
      <ViewModeToggle selected={viewMode} onSelect={setViewMode} />
    </>
  );

  return (
    <>
    <ScreenWrapper scroll header={headerContent}>
      <View className="gap-6 pb-8">
        <View>
          <SectionHeader title={t("home.income")} />
          <BudgetCard
            hasIncome={hasIncome}
            isYearly={isYearly}
            incomeDisplayCents={incomeDisplayCents}
            totalCents={totalCents}
            availableCents={availableCents}
            pinnedMetric={pinnedBudgetMetric}
            onPin={setPinnedBudgetMetric}
            onIncomeEdit={handleIncomeEdit}
            onMetricInfo={handleMetricInfo}
          />
        </View>

        {donutSegments.length > 0 && (
          <View>
            <SectionHeader title={t("home.breakdown")} />
            <DonutChart
              segments={donutSegments}
              totalCents={donutTotal}
              allLabel={t("home.allCategories")}
            />
          </View>
        )}

        <TopExpensesCard expenses={expenses} viewMode={viewMode} />
        <WalletBreakdownCard
          wallets={wallets}
          expenses={expenses}
          viewMode={viewMode}
        />
        <EssentialSplitCard
          expenses={expenses}
          viewMode={viewMode}
          onPriorityPress={handlePriorityPress}
        />
      </View>
    </ScreenWrapper>
    <PriorityExpensesSheet
      ref={prioritySheetRef}
      priority={selectedPriority}
    />
    <BottomSheet ref={metricInfoSheetRef} title={metricInfoContent.title}>
      <Text className="text-sm leading-6 text-gray-600">
        {metricInfoContent.body}
      </Text>
    </BottomSheet>
    </>
  );
}
