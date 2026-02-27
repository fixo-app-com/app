import { Text, View } from "react-native";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View className="mt-12 items-center">
      <Text className="text-gray-500">{message}</Text>
    </View>
  );
}
