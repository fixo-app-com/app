import type { ReactNode } from "react";
import { Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  right?: ReactNode;
}

export function SectionHeader({ title, right }: SectionHeaderProps) {
  return (
    <View className="mb-2 mt-4 flex-row items-center justify-between px-1">
      <Text className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {title}
      </Text>
      {right}
    </View>
  );
}
