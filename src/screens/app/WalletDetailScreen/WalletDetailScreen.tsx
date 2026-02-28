import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { deleteExpense, deleteWallet } from "../../../services/firestore";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import {
  Button,
  EmptyState,
  ScreenHeader,
  ScreenWrapper,
} from "../../../design-system";
import { CurrencyText, ExpenseCard } from "../../../components";
import { useFetchExpenses } from "../../../hooks/useFetchExpenses";

type Nav = NativeStackNavigationProp<WalletsStackParamList, "WalletDetail">;
type Route = RouteProp<WalletsStackParamList, "WalletDetail">;

export default function WalletDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { walletId, walletName, walletIcon } = route.params;
  const { user } = useAuth();
  const { categories, viewMode } = useData();

  const { expenses, loading, setExpenses } = useFetchExpenses({ walletId });

  function getCategoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? "—";
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

  function handleDeleteWallet() {
    Alert.alert("Delete wallet", `Delete "${walletName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!user) return;
          try {
            await deleteWallet(user.uid, walletId);
            navigation.goBack();
          } catch (error) {
            if (__DEV__) console.error("Failed to delete wallet:", error);
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
          data={[...expenses].sort(
            (a, b) =>
              getDisplayAmountCents(b, viewMode) -
              getDisplayAmountCents(a, viewMode),
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 160 }}
          renderItem={({ item }) => (
            <ExpenseCard
              name={item.name}
              walletName={getCategoryName(item.categoryId)}
              notes={item.notes}
              amountCents={item.amountCents}
              billingFrequency={item.billingFrequency ?? "monthly"}
              onPress={() =>
                navigation.navigate("AddEditExpense", {
                  categoryId: item.categoryId,
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
              message="No expenses for this wallet."
            />
          }
          ListFooterComponent={
            expenses.length === 0 ? (
              <View className="mt-8">
                <Button
                  label="Delete wallet"
                  variant="destructive"
                  onPress={handleDeleteWallet}
                />
              </View>
            ) : null
          }
        />
      )}
    </ScreenWrapper>
  );
}
