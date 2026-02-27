import type { ReactNode } from "react";
import { Pressable } from "react-native";

interface CardProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: ReactNode;
}

export function Card({ onPress, onLongPress, children }: CardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="rounded-xl border border-gray-800 bg-gray-900 p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {children}
    </Pressable>
  );
}
