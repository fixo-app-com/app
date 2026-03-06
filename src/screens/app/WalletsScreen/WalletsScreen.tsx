import { useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import {
  roundToUnit,
  getDisplayAmountCents,
  type Wallet,
} from "../../../types/firestore";
import {
  EmptyState,
  FloatingAction,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import { ViewModeToggle, WalletCard } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortSheet } from "../../../hooks/useSortSheet";
import { makeSortComparator } from "../../../utils/sort";

type Nav = NativeStackNavigationProp<WalletsStackParamList>;

export default function WalletsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { wallets, viewMode, setViewMode } = useData();

  const { expenses, loading: loadingExpenses } = useExpenses();
  const sort = useSortSheet("wallets");

  function getWalletTotal(walletId: string): number {
    return roundToUnit(
      expenses
        .filter((e) => e.walletId === walletId)
        .reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
    );
  }

  const headerContent = (
    <>
      <Text className="mb-4 text-3xl font-bold text-gray-900">{t("wallets.title")}</Text>

      {/* Monthly / Yearly toggle + sort */}
      <View className="flex-row items-center justify-between">
        <ViewModeToggle selected={viewMode} onSelect={setViewMode} />
        <SortTrigger
          label={sort.triggerLabel}
          onPress={sort.open}
        />
      </View>
    </>
  );

  const sortedWallets = useMemo(() => {
    const comparator = makeSortComparator<Wallet>(
      sort.selected,
      (w) => getWalletTotal(w.id),
      (w) => w.createdAt,
    );
    return [...wallets].sort(comparator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, sort.selected, expenses, viewMode]);

  return (
    <ScreenWrapper header={headerContent}>
      {loadingExpenses ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
        <FlatList
          data={sortedWallets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <WalletCard
              name={item.name}
              icon={item.icon ?? ""}
              totalCents={getWalletTotal(item.id)}
              onPress={() =>
                navigation.navigate("WalletDetail", {
                  walletId: item.id,
                  walletName: item.name,
                  walletIcon: item.icon,
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <EmptyState icon="wallet-outline" message={t("wallets.noWallets")} />
          }
        />
      )}

      <FloatingAction
        label={t("wallets.addWallet")}
        onPress={() => navigation.navigate("AddEditWallet", {})}
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
