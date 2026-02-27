import type { ReactNode } from "react";
import { Pressable } from "react-native";

interface CardProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: ReactNode;
}

export function Card({ onPress, onLongPress, children }: CardProps) {
  const isInteractive = !!onPress || !!onLongPress;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="rounded-2xl bg-gray-900 p-4"
      style={({ pressed }) => ({
        opacity: pressed && isInteractive ? 0.7 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}
