import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
import { Card, FullScreenLoader, ScreenWrapper } from "../../../design-system";
import { CurrencyText, WalletCard } from "../../../components";

type Nav = NativeStackNavigationProp<HomeStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { wallets, isLoading: dataLoading } = useData();

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
    return expenses
      .filter((e) => e.walletId === walletId)
      .reduce((sum, e) => sum + e.amountCents, 0);
  }

  const monthlyTotalCents = expenses.reduce(
    (sum, e) => sum + e.amountCents,
    0,
  );
  const yearlyTotalCents = monthlyTotalCents * 12;

  const walletsWithExpenses = useMemo(
    () => wallets.filter((w) => getWalletTotal(w.id) > 0),
    [wallets, expenses],
  );

  if (dataLoading) {
    return <FullScreenLoader />;
  }

  return (
    <ScreenWrapper>
      <Text className="mb-6 text-2xl font-bold text-white">Home</Text>

      {/* Monthly total card */}
      <Card>
        <View className="items-center py-2">
          <Text className="text-sm font-medium text-gray-400">
            Monthly total
          </Text>
          <CurrencyText
            cents={monthlyTotalCents}
            className="mt-1 text-3xl font-bold text-fixo-400"
          />
          <View className="mt-3 h-px w-16 bg-gray-700" />
          <Text className="mt-3 text-xs text-gray-500">Yearly estimate</Text>
          <CurrencyText
            cents={yearlyTotalCents}
            className="text-sm text-gray-400"
          />
        </View>
      </Card>

      <View className="mb-6" />

      {/* Wallet spending breakdown */}
      {loadingExpenses ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : walletsWithExpenses.length > 0 ? (
        <FlatList
          data={walletsWithExpenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <WalletCard
              name={item.name}
              icon={item.icon ?? ""}
              totalCents={getWalletTotal(item.id)}
              onPress={() => {}}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      ) : (
        <Text className="mt-4 text-center text-sm text-gray-500">
          No expenses yet.
        </Text>
      )}
    </ScreenWrapper>
  );
}
