import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import type { CategoriesStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
import { EmptyState, FullScreenLoader, ScreenWrapper } from "../../../design-system";
import { CategoryCard, FloatingAction } from "../../../components";

type Nav = NativeStackNavigationProp<CategoriesStackParamList, "Categories">;

export default function CategoriesScreen() {
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

  if (dataLoading) {
    return <FullScreenLoader />;
  }

  return (
    <ScreenWrapper>
      <Text className="mb-6 text-3xl font-bold text-white">Categories</Text>

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
            <EmptyState
              icon="grid-outline"
              message="No categories yet."
              actionLabel="Add category"
              onAction={() => navigation.navigate("AddCategory")}
            />
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
