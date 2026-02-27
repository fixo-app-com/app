import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses, deleteExpense } from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
import { EmptyState, ScreenHeader, ScreenWrapper } from "../../../design-system";
import { CurrencyText, ExpenseCard, FloatingAction } from "../../../components";

type Nav = NativeStackNavigationProp<HomeStackParamList, "CategoryDetail">;
type Route = RouteProp<HomeStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, categoryName } = route.params;
  const { user } = useAuth();
  const { wallets } = useData();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getExpenses(user.uid, categoryId);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to load expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [user, categoryId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchExpenses();
    });
    return unsubscribe;
  }, [navigation, fetchExpenses]);

  function getWalletName(walletId: string): string {
    return wallets.find((w) => w.id === walletId)?.name ?? "\u2014";
  }

  function handleDeleteExpense(expenseId: string, expenseName: string) {
    Alert.alert("Delete expense", `Delete "${expenseName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!user) return;
          try {
            await deleteExpense(user.uid, expenseId);
            setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
          } catch (error) {
            console.error("Failed to delete expense:", error);
          }
        },
      },
    ]);
  }

  const totalCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={categoryName}
        onBack={() => navigation.goBack()}
        right={
          <CurrencyText
            cents={totalCents}
            className="text-base font-semibold text-fixo-400"
          />
        }
      />

      {/* Expenses list */}
      {loading ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ExpenseCard
              name={item.name}
              walletName={getWalletName(item.walletId)}
              essential={item.essential}
              notes={item.notes}
              amountCents={item.amountCents}
              onPress={() =>
                navigation.navigate("AddEditExpense", {
                  categoryId,
                  expenseId: item.id,
                })
              }
              onLongPress={() => handleDeleteExpense(item.id, item.name)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          ListEmptyComponent={
            <EmptyState message="No expenses in this category." />
          }
        />
      )}

      <FloatingAction
        label="+ Add expense"
        onPress={() =>
          navigation.navigate("AddEditExpense", {
            categoryId,
          })
        }
      />
    </ScreenWrapper>
  );
}
