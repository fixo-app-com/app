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
import { deleteExpense } from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import { EmptyState, ScreenHeader, ScreenWrapper } from "../../../design-system";
import { CurrencyText, ExpenseCard, FloatingAction } from "../../../components";
import { useFetchExpenses } from "../../../hooks/useFetchExpenses";

type Nav = NativeStackNavigationProp<HomeStackParamList, "CategoryDetail">;
type Route = RouteProp<HomeStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, categoryName } = route.params;
  const { user } = useAuth();
  const { categories, wallets, viewMode } = useData();

  const category = categories.find((c) => c.id === categoryId);

  const { expenses, loading, setExpenses } = useFetchExpenses({ categoryId });

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
            if (__DEV__) console.error("Failed to delete expense:", error);
          }
        },
      },
    ]);
  }

  const totalCents = roundToUnit(
    expenses.reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
  );

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
          {viewMode === "yearly" ? "Yearly:" : "Monthly:"}{" "}
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
              notes={item.notes}
              amountCents={item.amountCents}
              billingFrequency={item.billingFrequency ?? "monthly"}
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
          ListFooterComponent={<View className="h-8" />}
        />
      )}

      <FloatingAction
        label="Add expense"
        onPress={() =>
          navigation.navigate("AddEditExpense", {
            categoryId,
          })
        }
      />
    </ScreenWrapper>
  );
}
