import { Pressable, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  label: string;
  onPress: () => void;
};

export function SortTrigger({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-2"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      testID="sort-trigger"
    >
      <Text className="text-sm text-gray-500">{label}</Text>
      <Ionicons
        name="swap-vertical-outline"
        size={16}
        color="#6b7280"
        style={{ marginLeft: 4 }}
      />
    </Pressable>
  );
}
