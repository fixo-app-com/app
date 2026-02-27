import { Text, View } from "react-native";
import { Card } from "../../design-system";
import { CurrencyText } from "../CurrencyText/CurrencyText";

interface ExpenseCardProps {
  name: string;
  walletName: string;
  essential: boolean;
  notes: string;
  amountCents: number;
  onPress: () => void;
  onLongPress: () => void;
}

export function ExpenseCard({
  name,
  walletName,
  essential,
  notes,
  amountCents,
  onPress,
  onLongPress,
}: ExpenseCardProps) {
  return (
    <Card onPress={onPress} onLongPress={onLongPress}>
      <View className="flex-row items-center justify-between">
        <View className="mr-4 flex-1">
          <Text className="text-base font-semibold text-white">{name}</Text>
          <Text className="mt-1 text-sm text-gray-400">
            {walletName}
            {essential ? " · Essential" : ""}
          </Text>
          {notes ? (
            <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
              {notes}
            </Text>
          ) : null}
        </View>
        <CurrencyText
          cents={amountCents}
          className="text-base font-semibold text-white"
        />
      </View>
    </Card>
  );
}
