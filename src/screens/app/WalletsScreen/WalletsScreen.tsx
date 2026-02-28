import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents, type Expense } from "../../../types/firestore";
import { EmptyState, ScreenWrapper } from "../../../design-system";
import { FloatingAction, WalletCard } from "../../../components";

type Nav = NativeStackNavigationProp<WalletsStackParamList>;

export default function WalletsScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { wallets, viewMode } = useData();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoadingExpenses(true);
    try {
      const data = await getExpenses(user.uid);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoadingExpenses(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchExpenses();
    });
    return unsubscribe;
  }, [navigation, fetchExpenses]);

  function getWalletTotal(walletId: string): number {
    return roundToUnit(
      expenses
        .filter((e) => e.walletId === walletId)
        .reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
    );
  }

  return (
    <ScreenWrapper>
      <Text className="mb-6 text-3xl font-bold text-gray-900">Wallets</Text>

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
            <EmptyState
              icon="wallet-outline"
              message="No wallets yet."
              actionLabel="Add wallet"
              onAction={() => navigation.navigate("AddEditWallet", {})}
            />
          }
        />
      )}

      <FloatingAction
        label="+ Add wallet"
        onPress={() => navigation.navigate("AddEditWallet", {})}
      />
    </ScreenWrapper>
  );
}
