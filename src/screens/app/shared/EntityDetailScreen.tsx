import { useMemo, useRef } from "react";
import { Animated, Text, View } from "react-native";
import {
  FloatingAction,
  IconButton,
  ScreenHeader,
  ScreenWrapper,
  SortBottomSheet,
  SortTrigger,
} from "../../../design-system";
import { CurrencyText, ExpenseList } from "../../../components";
import { SCROLL_EVENT_THROTTLE } from "../../../constants/layout";
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
  getWalletName: (expense: Expense) => string;
  getCategoryName?: (expense: Expense) => string;
  onExpensePress: (expense: Expense) => void;
  onExpenseDelete: (expenseId: string) => Promise<void>;
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
  getWalletName,
  getCategoryName,
  onExpensePress,
  onExpenseDelete,
  onAdd,
}: Props) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollHandler = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY],
  );

  const headerContent = (
    <>
      <ScreenHeader
        title={title}
        onBack={onBack}
        variant="back"
        right={
          <IconButton
            name="create-outline"
            onPress={onEdit}
            accessibilityLabel="Edit"
          />
        }
      />

      <View className="mt-5 flex-row items-center justify-between">
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
    <ScreenWrapper header={headerContent} scrollY={scrollY}>
      <ExpenseList
        expenses={expenses}
        loading={loading}
        emptyMessage={emptyMessage}
        getWalletName={getWalletName}
        getCategoryName={getCategoryName}
        onPress={onExpensePress}
        onDelete={onExpenseDelete}
        onScroll={scrollHandler}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
      />

      {onAdd && <FloatingAction onPress={onAdd} />}

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
