import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
import { EmptyState, FullScreenLoader, ScreenWrapper } from "../../../design-system";
import { CategoryCard, CurrencyText, FloatingAction } from "../../../components";

type Nav = NativeStackNavigationProp<HomeStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { categories, isLoading: dataLoading } = useData();

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

  // Refetch when returning from other screens
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

  const totalCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);

  if (dataLoading) {
    return <FullScreenLoader />;
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <View className="mb-6 items-center">
        <Text className="text-lg font-semibold text-white">
          Monthly total
        </Text>
        <CurrencyText
          cents={totalCents}
          className="mt-1 text-2xl font-bold text-fixo-400"
        />
      </View>

      {/* Category cards */}
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
            <EmptyState message="No categories yet. Add one!" />
          }
        />
      )}

      <FloatingAction
        label="+ Add category"
        onPress={() => navigation.navigate("AddCategory")}
      />
    </ScreenWrapper>
  );
}
