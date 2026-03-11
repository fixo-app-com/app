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
  WalletsStackParamList,
} from "../../../navigation/RootNavigator";
import { sumDisplayCents } from "../../../types/firestore";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortSheet } from "../../../hooks/useSortSheet";
import { EntityDetailScreen } from "../shared/EntityDetailScreen";

type Nav = CompositeNavigationProp<
  NativeStackNavigationProp<WalletsStackParamList, "WalletDetail">,
  NativeStackNavigationProp<AppRootStackParamList>
>;
type Route = RouteProp<WalletsStackParamList, "WalletDetail">;

export default function WalletDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { walletId } = route.params;
  const { wallets, categories, viewMode, deleteExpense } = useData();

  const wallet = wallets.find((w) => w.id === walletId);
  const walletName = wallet?.name ?? route.params.walletName;
  const walletIcon = wallet?.icon ?? route.params.walletIcon;

  const sort = useSortSheet("expenses");
  const { expenses, loading } = useExpenses({ walletId, sort: sort.selected });

  const totalCents = sumDisplayCents(expenses, viewMode);

  return (
    <EntityDetailScreen
      title={walletName}
      onBack={() => navigation.goBack()}
      onEdit={() =>
        navigation.navigate("AddEditWallet", {
          walletId,
          walletName,
          walletIcon,
        })
      }
      summaryPrefix={
        viewMode === "yearly"
          ? t("walletDetail.yearlyPrefix")
          : t("walletDetail.monthlyPrefix")
      }
      totalCents={totalCents}
      sort={sort}
      expenses={expenses}
      loading={loading}
      emptyMessage={t("walletDetail.noExpenses")}
      getWalletName={(e) =>
        categories.find((c) => c.id === e.categoryId)?.name ?? "\u2014"
      }
      onExpensePress={(e) =>
        navigation.navigate("AddEditExpense", {
          categoryId: e.categoryId,
          expenseId: e.id,
        })
      }
      onExpenseDelete={(id) => deleteExpense(id)}
    />
  );
}
