import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useData } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import {
  ScreenHeader,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import { CurrencyText, ExpenseList } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortPreferences } from "../../../hooks/useSortPreferences";
import { getSortLabelKey } from "../../../constants/sort";

type Nav = NativeStackNavigationProp<WalletsStackParamList, "WalletDetail">;
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

  const { sortPrefs, setSortFor } = useSortPreferences();
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  const { expenses, loading } = useExpenses({
    walletId,
    sort: sortPrefs.expenses,
  });

  const totalCents = roundToUnit(
    expenses.reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
  );

  const headerContent = (
    <>
      <ScreenHeader
        title={walletName}
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() =>
              navigation.navigate("AddEditWallet", {
                walletId,
                walletName,
                walletIcon,
              })
            }
            className="items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              width: 44,
              height: 44,
            })}
            hitSlop={8}
          >
            <Ionicons name="create-outline" size={22} color="#6b7280" />
          </Pressable>
        }
      />

      {/* Summary + sort */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500">
          {viewMode === "yearly" ? t("walletDetail.yearlyPrefix") : t("walletDetail.monthlyPrefix")}{" "}
          <CurrencyText
            cents={totalCents}
            className="text-sm font-semibold text-fixo-400"
          />
        </Text>
        <SortTrigger
          label={t(getSortLabelKey(sortPrefs.expenses))}
          onPress={() => setSortSheetOpen(true)}
        />
      </View>
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      <ExpenseList
        expenses={expenses}
        loading={loading}
        emptyMessage={t("walletDetail.noExpenses")}
        getSubtitle={(e) =>
          categories.find((c) => c.id === e.categoryId)?.name ?? "\u2014"
        }
        onPress={(e) =>
          navigation.navigate("AddEditExpense", {
            categoryId: e.categoryId,
            expenseId: e.id,
          })
        }
        onDelete={(id) => deleteExpense(id)}
      />

      <SortBottomSheet
        visible={sortSheetOpen}
        selected={sortPrefs.expenses}
        onSelect={(opt) => setSortFor("expenses", opt)}
        onClose={() => setSortSheetOpen(false)}
      />
    </ScreenWrapper>
  );
}
