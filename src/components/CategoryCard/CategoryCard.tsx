import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card } from "../../design-system";
import { CurrencyText } from "../CurrencyText/CurrencyText";

interface CategoryCardProps {
  icon: string;
  name: string;
  expenseCount: number;
  totalCents: number;
  onPress: () => void;
}

export function CategoryCard({
  icon,
  name,
  expenseCount,
  totalCents,
  onPress,
}: CategoryCardProps) {
  return (
    <Card onPress={onPress}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <Text className="mr-3 text-2xl">{icon}</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold text-white">{name}</Text>
            <Text className="text-sm text-gray-400">
              {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <CurrencyText
            cents={totalCents}
            className="mr-2 text-base font-semibold text-white"
          />
          <Ionicons name="chevron-forward" size={20} color="#64748b" />
        </View>
      </View>
    </Card>
  );
}
