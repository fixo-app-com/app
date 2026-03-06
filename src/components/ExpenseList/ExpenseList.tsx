import { ActivityIndicator, FlatList, View } from "react-native";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../design-system";
import { ExpenseCard } from "../ExpenseCard/ExpenseCard";
import { SwipeableRow } from "../SwipeableRow/SwipeableRow";
import type { Expense } from "../../types/firestore";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  emptyMessage: string;
  getSubtitle: (expense: Expense) => string;
  onPress: (expense: Expense) => void;
  onDelete: (expenseId: string) => Promise<void>;
}

export function ExpenseList({
  expenses,
  loading,
  emptyMessage,
  getSubtitle,
  onPress,
  onDelete,
}: ExpenseListProps) {
  const { t } = useTranslation();

  if (loading) {
    return <ActivityIndicator color="#818cf8" className="mt-8" />;
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      renderItem={({ item }) => (
        <SwipeableRow
          onDelete={() => onDelete(item.id)}
          errorMessage={t("expenseList.deleteFailed", { name: item.name })}
        >
          <ExpenseCard
            name={item.name}
            walletName={getSubtitle(item)}
            notes={item.notes}
            amountCents={item.amountCents}
            billingFrequency={item.billingFrequency ?? "monthly"}
            essential={item.essential}
            onPress={() => onPress(item)}
            onLongPress={() => {}}
          />
        </SwipeableRow>
      )}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListEmptyComponent={
        <EmptyState icon="receipt-outline" message={emptyMessage} />
      }
    />
  );
}
