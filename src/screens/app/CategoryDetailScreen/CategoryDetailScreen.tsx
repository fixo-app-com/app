import { useTranslation } from "react-i18next";
import {
  CompositeNavigationProp,
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type {
  AppRootStackParamList,
  CategoriesStackParamList,
} from "../../../navigation/RootNavigator";
import { sumDisplayCents } from "../../../types/firestore";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortSheet } from "../../../hooks/useSortSheet";
import { EntityDetailScreen } from "../shared/EntityDetailScreen";

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<CategoriesStackParamList, "CategoryDetail">,
  NativeStackNavigationProp<AppRootStackParamList>
>;
type Route = RouteProp<CategoriesStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId } = route.params;
  const { categories, wallets, viewMode, deleteExpense } = useData();

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category?.name ?? route.params.categoryName;

  const sort = useSortSheet("expenses");
  const { expenses, loading } = useExpenses({
    categoryId,
    sort: sort.selected,
  });

  const totalCents = sumDisplayCents(expenses, viewMode);

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
      summaryPrefix={
        viewMode === "yearly"
          ? t("categoryDetail.yearlyPrefix")
          : t("categoryDetail.monthlyPrefix")
      }
      totalCents={totalCents}
      sort={sort}
      expenses={expenses}
      loading={loading}
      emptyMessage={t("categoryDetail.noExpenses")}
      getWalletName={(e) =>
        wallets.find((w) => w.id === e.walletId)?.name ?? "\u2014"
      }
      onExpensePress={(e) =>
        navigation.navigate("AddEditExpense", { categoryId, expenseId: e.id })
      }
      onExpenseDelete={(id) => deleteExpense(id)}
      onAdd={() => navigation.navigate("AddEditExpense", { categoryId })}
    />
  );
}
