import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}

export function ScreenHeader({ title, onBack, right }: ScreenHeaderProps) {
  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Pressable
          onPress={onBack}
          className="mr-3 rounded-lg px-2 py-1"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="text-2xl text-gray-400">{"\u2039"}</Text>
        </Pressable>
        <Text className="text-xl font-bold text-white">{title}</Text>
      </View>
      {right}
    </View>
  );
}
