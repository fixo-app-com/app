import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface IconButtonProps {
  name: IoniconsName;
  size?: number;
  color?: string;
  onPress: () => void;
  accessibilityLabel?: string;
  hitSlop?: number;
}

export function IconButton({
  name,
  size = 22,
  color = "#6b7280",
  onPress,
  accessibilityLabel,
  hitSlop = 8,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      className="items-center justify-center"
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        width: 44,
        height: 44,
      })}
      hitSlop={hitSlop}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}
