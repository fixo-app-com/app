import { forwardRef, useCallback, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useData } from "../../../contexts/DataContext";
import type { Expense, ExpensePriority } from "../../../types/firestore";
import { EmptyState } from "../../../design-system";
import { ExpenseCard, ExpenseForm, SwipeableRow } from "../../../components";

type SheetMode = { type: "list" } | { type: "edit"; expense: Expense };

interface PriorityExpensesSheetProps {
  priority: ExpensePriority;
}

export const PriorityExpensesSheet = forwardRef<
  BottomSheetModal,
  PriorityExpensesSheetProps
>(function PriorityExpensesSheet({ priority }, ref) {
  const { t } = useTranslation();
  const { expenses, wallets, deleteExpense } = useData();
  const [mode, setMode] = useState<SheetMode>({ type: "list" });

  const filtered = useMemo(
    () => (expenses ?? []).filter((e) => e.priority === priority),
    [expenses, priority],
  );

  const walletMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const w of wallets) map[w.id] = w.name;
    return map;
  }, [wallets]);

  const snapPoints = useMemo(
    () => (mode.type === "list" ? ["50%", "85%"] : ["92%"]),
    [mode.type],
  );

  const animationConfigs = useMemo(
    () => ({ duration: 350, easing: Easing.out(Easing.cubic) }),
    [],
  );

  const renderBackdrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleDismiss = useCallback(() => {
    setMode({ type: "list" });
  }, []);

  const priorityLabel: Record<ExpensePriority, string> = {
    essential: t("home.essential"),
    reducible: t("home.reducible"),
    optional: t("home.optional"),
  };

  const priorityHint: Record<ExpensePriority, string> = {
    essential: t("addEditExpense.priorityHintEssential"),
    reducible: t("addEditExpense.priorityHintReducible"),
    optional: t("addEditExpense.priorityHintOptional"),
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      animationConfigs={animationConfigs}
      backgroundStyle={{
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#f3f4f6",
      }}
      handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 40 }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        {mode.type === "list" ? (
          <>
            <View className="mb-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">
                  {priorityLabel[priority]}
                </Text>
                <Pressable
                  onPress={() => {
                    if (ref && "current" in ref) ref.current?.dismiss();
                  }}
                  hitSlop={8}
                  className="items-center justify-center"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.6 : 1,
                    width: 32,
                    height: 32,
                  })}
                >
                  <Ionicons name="close" size={22} color="#6b7280" />
                </Pressable>
              </View>
              <Text className="mt-1 text-sm text-gray-400">
                {priorityHint[priority]}
              </Text>
            </View>

            {filtered.length === 0 ? (
              <EmptyState
                icon="receipt-outline"
                message={t("home.noExpensesForPriority")}
              />
            ) : (
              filtered.map((expense, index) => (
                <SwipeableRow
                  key={expense.id}
                  onDelete={() => deleteExpense(expense.id)}
                  errorMessage={t("expenseList.deleteFailed", {
                    name: expense.name,
                  })}
                  spacing={index < filtered.length - 1 ? 12 : 0}
                >
                  <ExpenseCard
                    name={expense.name}
                    walletName={walletMap[expense.walletId] ?? ""}
                    notes={expense.notes}
                    amountCents={expense.amountCents}
                    billingFrequency={expense.billingFrequency}
                    onPress={() => setMode({ type: "edit", expense })}
                    onLongPress={() => {}}
                  />
                </SwipeableRow>
              ))
            )}
          </>
        ) : (
          <>
            <View className="mb-3">
              <Pressable
                onPress={() => setMode({ type: "list" })}
                hitSlop={8}
                className="flex-row items-center self-start"
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Ionicons name="chevron-back" size={22} color="#6b7280" />
                <Text className="ml-1 text-base text-gray-500">
                  {priorityLabel[priority]}
                </Text>
              </Pressable>
            </View>

            <ExpenseForm
              expense={mode.expense}
              onComplete={() => setMode({ type: "list" })}
            />
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});
