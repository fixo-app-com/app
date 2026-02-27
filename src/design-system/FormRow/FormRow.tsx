import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

interface FormRowProps {
  label: string;
  right?: ReactNode;
  onPress?: () => void;
  first?: boolean;
  last?: boolean;
}

export function FormRow({ label, right, onPress, first, last }: FormRowProps) {
  const roundedTop = first ? "rounded-t-2xl" : "";
  const roundedBottom = last ? "rounded-b-2xl" : "";
  const borderBottom = last ? "" : "border-b border-gray-800";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center justify-between bg-gray-900 px-4 py-3.5 ${roundedTop} ${roundedBottom} ${borderBottom}`}
      style={({ pressed }) => ({ opacity: pressed && onPress ? 0.7 : 1 })}
    >
      <Text className="text-base text-white">{label}</Text>
      {right}
    </Pressable>
  );
}
