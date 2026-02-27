import { Text, View } from "react-native";
import { Card } from "../../design-system";

interface WalletCardProps {
  name: string;
  onPress: () => void;
  onLongPress: () => void;
}

export function WalletCard({ name, onPress, onLongPress }: WalletCardProps) {
  return (
    <Card onPress={onPress} onLongPress={onLongPress}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="mr-3 text-xl">{"\uD83D\uDCB3"}</Text>
          <Text className="text-base font-semibold text-white">{name}</Text>
        </View>
        <Text className="text-gray-500">{"\u203A"}</Text>
      </View>
    </Card>
  );
}
