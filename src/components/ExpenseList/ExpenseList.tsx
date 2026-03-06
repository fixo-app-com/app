import { ActivityIndicator, FlatList, View } from "react-native";
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
  if (loading) {
    return <ActivityIndicator color="#818cf8" className="mt-8" />;
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 160 }}
      renderItem={({ item }) => (
        <SwipeableRow
          onDelete={() => onDelete(item.id)}
          errorMessage={`Could not delete "${item.name}". Please try again.`}
        >
          <ExpenseCard
            name={item.name}
            walletName={getSubtitle(item)}
            notes={item.notes}
            amountCents={item.amountCents}
            billingFrequency={item.billingFrequency ?? "monthly"}
            onPress={() => onPress(item)}
            onLongPress={() => {}}
          />
        </SwipeableRow>
      )}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListEmptyComponent={
        <EmptyState icon="receipt-outline" message={emptyMessage} />
      }
      ListFooterComponent={<View className="h-8" />}
    />
  );
}
