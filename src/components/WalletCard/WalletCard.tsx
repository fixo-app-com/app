import { Text, View } from "react-native";
import { Card } from "../../design-system";
import { BankIcon } from "../BankIcon/BankIcon";
import { CurrencyText } from "../CurrencyText/CurrencyText";

interface WalletCardProps {
  name: string;
  icon: string;
  totalCents?: number;
  onPress: () => void;
  onLongPress?: () => void;
}

export function WalletCard({
  name,
  icon,
  totalCents,
  onPress,
  onLongPress,
}: WalletCardProps) {
  return (
    <Card onPress={onPress} onLongPress={onLongPress}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-3">
            <BankIcon bankKey={icon} size={36} />
          </View>
          <Text className="text-base font-semibold text-white">{name}</Text>
        </View>
        {totalCents !== undefined ? (
          <CurrencyText
            cents={totalCents}
            className="text-base font-semibold text-fixo-400"
          />
        ) : (
          <Text className="text-gray-500">{"\u203A"}</Text>
        )}
      </View>
    </Card>
  );
}
