import type { ReactNode } from "react";
import { Pressable } from "react-native";

interface CardProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: ReactNode;
  testID?: string;
}

export function Card({ onPress, onLongPress, children, testID }: CardProps) {
  const isInteractive = !!onPress || !!onLongPress;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="rounded-2xl bg-white p-4"
      style={({ pressed }) => ({
        opacity: pressed && isInteractive ? 0.7 : 1,
      })}
      testID={testID}
    >
      {children}
    </Pressable>
  );
}
