import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { ViewMode } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import {
  roundToUnit,
  getDisplayAmountCents,
  type Wallet,
} from "../../../types/firestore";
import {
  ChipGroup,
  EmptyState,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import { FloatingAction, WalletCard } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortPreferences } from "../../../hooks/useSortPreferences";
import { getSortLabel } from "../../../constants/sort";
import { makeSortComparator } from "../../../utils/sort";

type Nav = NativeStackNavigationProp<WalletsStackParamList>;

export default function WalletsScreen() {
  const navigation = useNavigation<Nav>();
  const { wallets, viewMode, setViewMode } = useData();

  const { expenses, loading: loadingExpenses } = useExpenses();
  const { sortPrefs, setSortFor } = useSortPreferences();
  const [sortSheetOpen, setSortSheetOpen] = useState(false);

  function getWalletTotal(walletId: string): number {
    return roundToUnit(
      expenses
        .filter((e) => e.walletId === walletId)
        .reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
    );
  }

  const headerContent = (
    <>
      <Text className="mb-4 text-3xl font-bold text-gray-900">Wallets</Text>

      {/* Monthly / Yearly toggle + sort */}
      <View className="flex-row items-center justify-between">
        <ChipGroup
          options={[
            { value: "monthly" as ViewMode, label: "Monthly" },
            { value: "yearly" as ViewMode, label: "Yearly" },
          ]}
          selected={viewMode}
          onSelect={setViewMode}
          compact
        />
        <SortTrigger
          label={getSortLabel(sortPrefs.wallets)}
          onPress={() => setSortSheetOpen(true)}
        />
      </View>
    </>
  );

  const sortedWallets = useMemo(() => {
    const comparator = makeSortComparator<Wallet>(
      sortPrefs.wallets,
      (w) => getWalletTotal(w.id),
      (w) => w.createdAt,
    );
    return [...wallets].sort(comparator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets, sortPrefs.wallets, expenses, viewMode]);

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
            <EmptyState icon="wallet-outline" message="No wallets yet." />
          }
        />
      )}

      <FloatingAction
        label="Add wallet"
        onPress={() => navigation.navigate("AddEditWallet", {})}
      />

      <SortBottomSheet
        visible={sortSheetOpen}
        selected={sortPrefs.wallets}
        onSelect={(opt) => setSortFor("wallets", opt)}
        onClose={() => setSortSheetOpen(false)}
      />
    </ScreenWrapper>
  );
}
