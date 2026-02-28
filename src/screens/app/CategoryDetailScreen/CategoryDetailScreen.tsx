import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import {
  getExpenses,
  deleteExpense,
  deleteExpensesByCategory,
} from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
import {
  Button,
  EmptyState,
  ScreenHeader,
  ScreenWrapper,
} from "../../../design-system";
import { CurrencyText, ExpenseCard, FloatingAction } from "../../../components";

type Nav = NativeStackNavigationProp<HomeStackParamList, "CategoryDetail">;
type Route = RouteProp<HomeStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, categoryName } = route.params;
  const { user } = useAuth();
  const { categories, wallets, deleteCategory } = useData();

  const category = categories.find((c) => c.id === categoryId);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getExpenses(user.uid, { categoryId });
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
    return wallets.find((w) => w.id === walletId)?.name ?? "—";
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

  function handleDeleteCategory() {
    const count = expenses.length;
    const message =
      count > 0
        ? `This will permanently delete "${categoryName}" and all ${count} expense${count === 1 ? "" : "s"} inside it. This action cannot be undone.`
        : `Delete "${categoryName}"? This action cannot be undone.`;

    Alert.alert("Delete category", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!user) return;
          try {
            if (count > 0) {
              await deleteExpensesByCategory(user.uid, categoryId);
            }
            await deleteCategory(categoryId);
            navigation.goBack();
          } catch (error) {
            console.error("Failed to delete category:", error);
          }
        },
      },
    ]);
  }

  const totalCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);

  return (
    <ScreenWrapper>
      <ScreenHeader
        title={category?.name ?? categoryName}
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() =>
              navigation.navigate("AddEditCategory", {
                categoryId,
                categoryName: category?.name ?? categoryName,
                categoryIcon: category?.icon,
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

      {/* Summary */}
      <View className="mb-4">
        <Text className="text-sm text-gray-500">
          Total:{" "}
          <CurrencyText
            cents={totalCents}
            className="text-sm font-semibold text-fixo-400"
          />
        </Text>
      </View>

      {/* Expenses list */}
      {loading ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 160 }}
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
            <EmptyState
              icon="receipt-outline"
              message="No expenses in this category."
            />
          }
          ListFooterComponent={
            <View className="mt-8">
              <Button
                label="Delete category"
                variant="destructive"
                onPress={handleDeleteCategory}
              />
            </View>
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
