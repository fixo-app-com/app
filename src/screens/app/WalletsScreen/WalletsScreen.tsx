import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { ViewMode } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import { ChipGroup, EmptyState, ScreenWrapper } from "../../../design-system";
import { FloatingAction, WalletCard } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";

type Nav = NativeStackNavigationProp<WalletsStackParamList>;

export default function WalletsScreen() {
  const navigation = useNavigation<Nav>();
  const { wallets, viewMode, setViewMode } = useData();

  const { expenses, loading: loadingExpenses } = useExpenses();

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

      {/* Monthly / Yearly toggle */}
      <ChipGroup
        options={[
          { value: "monthly" as ViewMode, label: "Monthly" },
          { value: "yearly" as ViewMode, label: "Yearly" },
        ]}
        selected={viewMode}
        onSelect={setViewMode}
        compact
      />
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      {loadingExpenses ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
        <FlatList
          data={[...wallets].sort(
            (a, b) => getWalletTotal(b.id) - getWalletTotal(a.id),
          )}
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
    </ScreenWrapper>
  );
}
