import { Text, View } from "react-native";
import { Card } from "../../design-system";
import { CurrencyText } from "../CurrencyText/CurrencyText";
import { useData } from "../../contexts/DataContext";
import type { BillingFrequency } from "../../types/firestore";
import { getDisplayAmountCents } from "../../types/firestore";

interface ExpenseCardProps {
  name: string;
  walletName: string;
  notes: string;
  amountCents: number;
  billingFrequency: BillingFrequency;
  onPress: () => void;
  onLongPress: () => void;
}

export function ExpenseCard({
  name,
  walletName,
  notes,
  amountCents,
  billingFrequency,
  onPress,
  onLongPress,
}: ExpenseCardProps) {
  const { viewMode } = useData();
  const displayCents = getDisplayAmountCents({ amountCents, billingFrequency }, viewMode);

  return (
    <Card onPress={onPress} onLongPress={onLongPress}>
      <View className="flex-row items-center justify-between">
        <View className="mr-4 flex-1">
          <Text className="text-base font-semibold text-gray-900">{name}</Text>
          <Text className="mt-1 text-sm text-gray-500">{walletName}</Text>
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
