import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useData } from "../../../contexts/DataContext";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import { roundToUnit, getDisplayAmountCents } from "../../../types/firestore";
import type { ViewMode } from "../../../contexts/DataContext";
import {
  Card,
  ChipGroup,
  EmptyState,
  FullScreenLoader,
  ScreenWrapper,
} from "../../../design-system";
import {
  CategoryCard,
  CurrencyText,
  FloatingAction,
} from "../../../components";
import { useFetchExpenses } from "../../../hooks/useFetchExpenses";

type Nav = NativeStackNavigationProp<HomeStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const {
    categories,
    monthlyBudgetCents,
    setMonthlyBudget,
    viewMode,
    setViewMode,
    isLoading: dataLoading,
  } = useData();

  const { expenses, loading: loadingExpenses } = useFetchExpenses();

  const isYearly = viewMode === "yearly";

  function getCategoryTotal(categoryId: string): number {
    return roundToUnit(
      expenses
        .filter((e) => e.categoryId === categoryId)
        .reduce((sum, e) => sum + getDisplayAmountCents(e, viewMode), 0),
    );
  }

  function getCategoryCount(categoryId: string): number {
    return expenses.filter((e) => e.categoryId === categoryId).length;
  }

  const rawTotalCents = expenses.reduce(
    (sum, e) => sum + getDisplayAmountCents(e, viewMode),
    0,
  );
  const totalCents = roundToUnit(rawTotalCents);
  const budgetDisplayCents = isYearly
    ? monthlyBudgetCents * 12
    : monthlyBudgetCents;
  const availableCents = budgetDisplayCents - rawTotalCents;
  const hasBudget = monthlyBudgetCents > 0;

  function handleBudgetEdit() {
    const displayCents = isYearly
      ? monthlyBudgetCents * 12
      : monthlyBudgetCents;
    const current = hasBudget ? String(Math.floor(displayCents / 100)) : "";
    const label = isYearly ? "Yearly budget" : "Monthly budget";
    Alert.prompt(
      label,
      `Enter your total ${isYearly ? "yearly" : "monthly"} budget`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: (value?: string) => {
            const parsed = parseFloat((value ?? "").replace(",", "."));
            if (!isNaN(parsed) && parsed >= 0) {
              const cents = Math.round(parsed * 100);
              setMonthlyBudget(isYearly ? Math.ceil(cents / 12) : cents);
            }
          },
        },
      ],
      "plain-text",
      current,
      "number-pad",
    );
  }

  if (dataLoading) {
    return <FullScreenLoader />;
  }

  return (
    <ScreenWrapper>
      <Text className="mb-4 text-3xl font-bold text-gray-900">Home</Text>

      <Card>
        <View className="py-2">
          {/* Budget header */}
          <Pressable
            onPress={handleBudgetEdit}
            className="flex-row items-center justify-center"
          >
            <Text className="text-sm font-medium text-gray-500">
              {hasBudget
                ? isYearly
                  ? "Yearly budget"
                  : "Monthly budget"
                : isYearly
                  ? "Set yearly budget"
                  : "Set monthly budget"}
            </Text>
            <Ionicons
              name="pencil-outline"
              size={14}
              color="#9ca3af"
              style={{ marginLeft: 6 }}
            />
          </Pressable>

          {hasBudget ? (
            <>
              {/* Budget amount */}
              <Pressable onPress={handleBudgetEdit}>
                <CurrencyText
                  cents={budgetDisplayCents}
                  className="mt-1 text-center text-4xl font-bold text-gray-900"
                  suffixFormat
                />
              </Pressable>

              {/* Breakdown */}
              <View className="mt-4 border-t border-gray-100 pt-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">Ordinary costs</Text>
                  <CurrencyText
                    cents={totalCents}
                    className="text-sm font-semibold text-gray-700"
                    hideDecimals
                  />
                </View>
                <View className="mt-2 flex-row items-center justify-between">
                  <Text className="text-sm text-gray-500">Available</Text>
                  <CurrencyText
                    cents={availableCents}
                    className={`text-sm font-semibold ${availableCents >= 0 ? "text-emerald-600" : "text-red-500"}`}
                    hideDecimals
                  />
                </View>
              </View>
            </>
          ) : (
            <CurrencyText
              cents={totalCents}
              className="mt-1 text-center text-4xl font-bold text-gray-900"
            />
          )}
        </View>
      </Card>

      {/* Monthly / Yearly toggle */}
      <View className="mb-2 mt-4">
        <ChipGroup
          options={[
            { value: "monthly" as ViewMode, label: "Monthly" },
            { value: "yearly" as ViewMode, label: "Yearly" },
          ]}
          selected={viewMode}
          onSelect={setViewMode}
          compact
        />
      </View>

      {loadingExpenses ? (
        <ActivityIndicator color="#818cf8" className="mt-8" />
      ) : (
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
            <EmptyState icon="grid-outline" message="No categories yet." />
          }
        />
      )}

      <FloatingAction
        label="+ Add category"
        onPress={() => navigation.navigate("AddEditCategory", {})}
      />
    </ScreenWrapper>
  );
}
