import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import { colors } from "../../../constants/colors";
import type { CategoriesStackParamList } from "../../../navigation/RootNavigator";
import {
  EmptyState,
  FloatingAction,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import { CategoryCard, ListSpacer, ViewModeToggle } from "../../../components";
import { useExpenses } from "../../../hooks/useExpenses";
import { useSortSheet } from "../../../hooks/useSortSheet";
import { useEntityList } from "../../../hooks/useEntityList";

type Nav = NativeStackNavigationProp<CategoriesStackParamList>;

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const { categories, viewMode, setViewMode } = useData();

  const { expenses, loading: loadingExpenses } = useExpenses();
  const sort = useSortSheet("categories");
  const { sorted: sortedCategories, getTotal: getCategoryTotal } =
    useEntityList(categories, expenses, viewMode, sort.selected, "categoryId");

  function getCategoryCount(categoryId: string): number {
    return expenses.filter((e) => e.categoryId === categoryId).length;
  }

  const headerContent = (
    <>
      <Text className="mb-4 text-3xl font-bold text-gray-900">
        {t("categories.title")}
      </Text>

      <View className="flex-row items-center justify-between">
        <ViewModeToggle selected={viewMode} onSelect={setViewMode} />
        <SortTrigger label={sort.triggerLabel} onPress={sort.open} />
      </View>
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      {loadingExpenses ? (
        <ActivityIndicator color={colors.fixo[400]} className="mt-8" />
      ) : (
        <FlatList
          data={sortedCategories}
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
          ItemSeparatorComponent={ListSpacer}
          ListEmptyComponent={
            <EmptyState
              icon="grid-outline"
              message={t("categories.noCategories")}
            />
          }
        />
      )}

      <FloatingAction
        onPress={() => navigation.navigate("AddEditCategory", {})}
      />

      <SortBottomSheet
        visible={sort.isOpen}
        title={sort.title}
        options={sort.options}
        selected={sort.selected}
        onSelect={sort.select}
        onClose={sort.close}
      />
    </ScreenWrapper>
  );
}
