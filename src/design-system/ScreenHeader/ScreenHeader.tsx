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
          className="mr-2 items-center justify-center"
          style={({ pressed }) => ({
            opacity: pressed ? 0.6 : 1,
            width: 44,
            height: 44,
          })}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color="#94a3b8" />
        </Pressable>
        <Text
          className="flex-1 text-lg font-semibold text-white"
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}
