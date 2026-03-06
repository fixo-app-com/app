import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortSheet } from "../../../hooks/useSortSheet";
import { EntityDetailScreen } from "../shared/EntityDetailScreen";

type Nav = NativeStackNavigationProp<HomeStackParamList, "CategoryDetail">;
type Route = RouteProp<HomeStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId } = route.params;
  const { categories, wallets, viewMode, deleteExpense } = useData();

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category?.name ?? route.params.categoryName;

  const sort = useSortSheet("expenses");
  const { expenses, loading } = useExpenses({ categoryId, sort: sort.selected });

  const totalCents = roundToUnit(
    expenses.reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
  );

  return (
    <EntityDetailScreen
      title={categoryName}
      onBack={() => navigation.goBack()}
      onEdit={() =>
        navigation.navigate("AddEditCategory", {
          categoryId,
          categoryName,
          categoryIcon: category?.icon,
        })
      }
      summaryPrefix={viewMode === "yearly" ? t("categoryDetail.yearlyPrefix") : t("categoryDetail.monthlyPrefix")}
      totalCents={totalCents}
      sort={sort}
      expenses={expenses}
      loading={loading}
      emptyMessage={t("categoryDetail.noExpenses")}
      getSubtitle={(e) => wallets.find((w) => w.id === e.walletId)?.name ?? "\u2014"}
      onExpensePress={(e) => navigation.navigate("AddEditExpense", { categoryId, expenseId: e.id })}
      onExpenseDelete={(id) => deleteExpense(id)}
      addLabel={t("categoryDetail.addExpense")}
      onAdd={() => navigation.navigate("AddEditExpense", { categoryId })}
    />
  );
}
