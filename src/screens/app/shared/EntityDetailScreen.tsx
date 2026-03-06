import { Text, View } from "react-native";
import {
  FloatingAction,
  IconButton,
  ScreenHeader,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import { CurrencyText, ExpenseList } from "../../../components";
import type { Expense } from "../../../types/firestore";
import type { useSortSheet } from "../../../hooks/useSortSheet";

type Props = {
  title: string;
  onBack: () => void;
  onEdit: () => void;
  summaryPrefix: string;
  totalCents: number;
  sort: ReturnType<typeof useSortSheet>;
  expenses: Expense[];
  loading: boolean;
  emptyMessage: string;
  getSubtitle: (expense: Expense) => string;
  onExpensePress: (expense: Expense) => void;
  onExpenseDelete: (expenseId: string) => Promise<void>;
  addLabel?: string;
  onAdd?: () => void;
};

export function EntityDetailScreen({
  title,
  onBack,
  onEdit,
  summaryPrefix,
  totalCents,
  sort,
  expenses,
  loading,
  emptyMessage,
  getSubtitle,
  onExpensePress,
  onExpenseDelete,
  addLabel,
  onAdd,
}: Props) {
  const headerContent = (
    <>
      <ScreenHeader
        title={title}
        onBack={onBack}
        right={
          <IconButton name="create-outline" onPress={onEdit} accessibilityLabel="Edit" />
        }
      />

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500">
          {summaryPrefix}{" "}
          <CurrencyText
            cents={totalCents}
            className="text-sm font-semibold text-fixo-400"
          />
        </Text>
        <SortTrigger label={sort.triggerLabel} onPress={sort.open} />
      </View>
    </>
  );

  return (
    <ScreenWrapper header={headerContent}>
      <ExpenseList
        expenses={expenses}
        loading={loading}
        emptyMessage={emptyMessage}
        getSubtitle={getSubtitle}
        onPress={onExpensePress}
        onDelete={onExpenseDelete}
      />

      {addLabel && onAdd && (
        <FloatingAction label={addLabel} onPress={onAdd} />
      )}

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
