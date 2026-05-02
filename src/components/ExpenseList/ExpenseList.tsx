import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ActivityIndicator, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../../design-system";
import { colors } from "../../constants/colors";
import { ExpenseCard } from "../ExpenseCard/ExpenseCard";
import { ListSpacer } from "../ListSpacer";
import { SwipeableRow } from "../SwipeableRow/SwipeableRow";
import type { Expense } from "../../types/firestore";

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  emptyMessage: string;
  getWalletName: (expense: Expense) => string;
  getCategoryName?: (expense: Expense) => string;
  onPress: (expense: Expense) => void;
  onDelete: (expenseId: string) => Promise<void>;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEventThrottle?: number;
}

export function ExpenseList({
  expenses,
  loading,
  emptyMessage,
  getWalletName,
  getCategoryName,
  onPress,
  onDelete,
  onScroll,
  scrollEventThrottle,
}: ExpenseListProps) {
  const { t } = useTranslation();

  if (loading) {
    return <ActivityIndicator color={colors.fixo[400]} className="mt-8" />;
  }

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 80 }}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      renderItem={({ item }) => (
        <SwipeableRow
          onDelete={() => onDelete(item.id)}
          errorMessage={t("expenseList.deleteFailed", { name: item.name })}
        >
          <ExpenseCard
            name={item.name}
            walletName={getWalletName(item)}
            categoryName={getCategoryName?.(item)}
            amountCents={item.amountCents}
            billingFrequency={item.billingFrequency ?? "monthly"}
            priority={item.priority}
            onPress={() => onPress(item)}
            onLongPress={() => {}}
          />
        </SwipeableRow>
      )}
      ItemSeparatorComponent={ListSpacer}
      ListEmptyComponent={
        <EmptyState icon="receipt-outline" message={emptyMessage} />
      }
    />
  );
}
