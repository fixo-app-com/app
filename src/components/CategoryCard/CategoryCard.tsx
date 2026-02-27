import { Text, View } from "react-native";
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
        <View className="flex-row items-center">
          <Text className="mr-3 text-2xl">{icon}</Text>
          <View>
            <Text className="text-base font-semibold text-white">{name}</Text>
            <Text className="text-sm text-gray-400">
              {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
            </Text>
          </View>
        </View>
        <CurrencyText
          cents={totalCents}
          className="text-base font-semibold text-fixo-400"
        />
      </View>
    </Card>
  );
}
