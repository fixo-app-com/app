import { Alert, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useData } from "../../../contexts/DataContext";
import {
  roundToUnit,
  getDisplayAmountCents,
  sumDisplayCents,
} from "../../../types/firestore";
import {
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

export default function HomeScreen() {
  const { t } = useTranslation();
  const {
    categories,
    wallets,
    monthlyBudgetCents,
    setMonthlyBudget,
    viewMode,
    setViewMode,
    isLoading: dataLoading,
    pinnedBudgetMetric,
    setPinnedBudgetMetric,
  } = useData();

  const { expenses } = useExpenses();

  const isYearly = viewMode === "yearly";

  const rawTotalCents = sumDisplayCents(expenses, viewMode);
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
    const period = isYearly
      ? t("common.yearly").toLowerCase()
      : t("common.monthly").toLowerCase();
    Alert.prompt(
      label,
      t("home.enterBudget", { period }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.save"),
          onPress: (value?: string) => {
            const trimmed = (value ?? "").trim();
            if (trimmed === "" || trimmed === "0") {
              setMonthlyBudget(0);
              return;
            }
            const parsed = parseFloat(trimmed.replace(",", "."));
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
    <ScreenWrapper scroll header={headerContent}>
      <View className="gap-4 pb-8">
        <View>
          <SectionHeader title={t("home.budget")} />
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
        <EssentialSplitCard expenses={expenses} viewMode={viewMode} />
      </View>
    </ScreenWrapper>
  );
}
