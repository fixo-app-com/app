import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import { ScreenHeader, ScreenWrapper } from "../../../design-system";
import { CurrencyText, ExpenseList, FloatingAction } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";

type Nav = NativeStackNavigationProp<HomeStackParamList, "CategoryDetail">;
type Route = RouteProp<HomeStackParamList, "CategoryDetail">;

export default function CategoryDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId } = route.params;
  const { categories, wallets, viewMode, deleteExpense } = useData();

  const category = categories.find((c) => c.id === categoryId);
  const categoryName = category?.name ?? route.params.categoryName;

  const { expenses, loading } = useExpenses({ categoryId });

  const totalCents = roundToUnit(
    expenses.reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
  );

  const headerContent = (
    <>
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
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      <ExpenseList
        expenses={expenses}
        loading={loading}
        emptyMessage="No expenses in this category."
        getSubtitle={(e) => wallets.find((w) => w.id === e.walletId)?.name ?? "—"}
        onPress={(e) =>
          navigation.navigate("AddEditExpense", {
            categoryId,
            expenseId: e.id,
          })
        }
        onDelete={(id) => deleteExpense(id)}
      />

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
