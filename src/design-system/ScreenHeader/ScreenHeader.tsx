import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}

export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-1 flex-row items-center">
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="mr-2 justify-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            height: 44,
          })}
          hitSlop={{ top: 8, bottom: 8, right: 8, left: 0 }}
        >
          <Ionicons name="chevron-back" size={24} color="#6b7280" />
        </Pressable>
        <Text
          className="flex-1 text-lg font-semibold text-gray-900"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
