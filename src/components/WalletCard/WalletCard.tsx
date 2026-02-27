import { View } from "react-native";
import { Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
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
            className="text-base font-semibold text-white"
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        )}
      </View>
    </Card>
  );
}
