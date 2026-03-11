import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card } from "../../design-system";
import { CurrencyText } from "../CurrencyText/CurrencyText";
import { useData } from "../../contexts/DataContext";
import type { BillingFrequency, ExpensePriority } from "../../types/firestore";
import { getDisplayAmountCents } from "../../types/firestore";

const priorityColor: Record<ExpensePriority, string> = {
  essential: "text-amber-500",
  reducible: "text-blue-500",
  optional: "text-gray-400",
};

interface ExpenseCardProps {
  name: string;
  walletName: string;
  categoryName?: string;
  notes: string;
  amountCents: number;
  billingFrequency: BillingFrequency;
  priority?: ExpensePriority;
  onPress: () => void;
  onLongPress: () => void;
}

export function ExpenseCard({
  name,
  walletName,
  categoryName,
  notes,
  amountCents,
  billingFrequency,
  priority,
  onPress,
  onLongPress,
}: ExpenseCardProps) {
  const { t } = useTranslation();
  const { viewMode } = useData();
  const displayCents = getDisplayAmountCents(
    { amountCents, billingFrequency },
    viewMode,
  );

  return (
    <Card onPress={onPress} onLongPress={onLongPress}>
      <View className="flex-row items-center justify-between">
        <View className="mr-4 flex-1">
          <Text className="text-base font-semibold text-gray-900">{name}</Text>
          <View className="mt-1 flex-row items-center">
            <Text className="text-sm text-gray-900">{walletName}</Text>
            {categoryName ? (
              <>
                <Text className="mx-2 text-sm text-gray-400">•</Text>
                <Text
                  className="shrink text-sm text-gray-400"
                  numberOfLines={1}
                >
                  {categoryName}
                </Text>
              </>
            ) : null}
            {priority && (
              <>
                <Text className="mx-2 text-sm text-gray-400">•</Text>
                <Text
                  className={`text-sm font-medium ${priorityColor[priority]}`}
                >
                  {t(`expenseCard.${priority}`)}
                </Text>
              </>
            )}
          </View>
          {notes ? (
            <Text className="mt-1 text-sm text-gray-400" numberOfLines={2}>
              {notes}
            </Text>
          ) : null}
        </View>
        <View className="items-end">
          <CurrencyText
            cents={displayCents}
            className="text-base font-semibold text-gray-900"
          />
        </View>
      </View>
    </Card>
  );
}
