import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "../Button/Button";

interface EmptyStateProps {
  message: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message, icon, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center py-16">
      {icon ? (
        <Ionicons
          name={icon as any}
          size={48}
          color="#94a3b8"
          style={{ marginBottom: 12 }}
        />
      ) : null}
      <Text className="text-center text-base text-gray-400">{message}</Text>
      {actionLabel && onAction ? (
        <View className="mt-4">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
