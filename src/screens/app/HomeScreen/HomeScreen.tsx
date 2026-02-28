import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
import {
  Card,
  ChipGroup,
  EmptyState,
  FullScreenLoader,
  ScreenWrapper,
} from "../../../design-system";
import { CategoryCard, CurrencyText, FloatingAction, WalletCard } from "../../../components";

type Nav = NativeStackNavigationProp<HomeStackParamList, "Home">;
type ViewMode = "categories" | "wallets";

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { categories, wallets, isLoading: dataLoading } = useData();

  const [viewMode, setViewMode] = useState<ViewMode>("categories");
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

  function getCategoryTotal(categoryId: string): number {
    return expenses
      .filter((e) => e.categoryId === categoryId)
      .reduce((sum, e) => sum + e.amountCents, 0);
  }

  function getCategoryCount(categoryId: string): number {
    return expenses.filter((e) => e.categoryId === categoryId).length;
  }

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

  if (dataLoading) {
    return <FullScreenLoader />;
  }

  return (
    <ScreenWrapper>
      <Text className="mb-4 text-3xl font-bold text-gray-900">Home</Text>

      <Card>
        <View className="items-center py-2">
          <Text className="text-sm font-medium text-gray-500">
            Monthly total
          </Text>
          <CurrencyText
            cents={monthlyTotalCents}
            className="mt-1 text-4xl font-bold text-gray-900"
          />
          <View className="mt-3 flex-row items-center">
            <Text className="text-xs text-gray-400">Yearly estimate  </Text>
            <CurrencyText
              cents={yearlyTotalCents}
              className="text-sm text-gray-500"
            />
          </View>
        </View>
      </Card>

      <View className="mb-4 mt-4">
        <ChipGroup
          options={[
            { value: "categories" as ViewMode, label: "Categories" },
            { value: "wallets" as ViewMode, label: "Wallets" },
          ]}
          selected={viewMode}
          onSelect={setViewMode}
          compact
        />
      </View>

      {loadingExpenses ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : viewMode === "categories" ? (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <CategoryCard
              icon={item.icon}
              name={item.name}
              expenseCount={getCategoryCount(item.id)}
              totalCents={getCategoryTotal(item.id)}
              onPress={() =>
                navigation.navigate("CategoryDetail", {
                  categoryId: item.id,
                  categoryName: item.name,
                })
              }
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <EmptyState
              icon="grid-outline"
              message="No categories yet."
              actionLabel="Add category"
              onAction={() => navigation.navigate("AddEditCategory", {})}
            />
          }
        />
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
        label={viewMode === "categories" ? "+ Add category" : "+ Add wallet"}
        onPress={() => {
          if (viewMode === "categories") {
            navigation.navigate("AddEditCategory", {});
          } else {
            navigation.navigate("AddEditWallet", {});
          }
        }}
      />
    </ScreenWrapper>
  );
}
