import { Pressable, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "destructive" | "outline";
  disabled?: boolean;
}

const variantStyles = {
  primary: {
    container: "items-center rounded-xl bg-fixo-400 py-4",
    text: "text-base font-semibold text-white",
  },
  destructive: {
    container: "items-center rounded-xl border border-red-800 py-4",
    text: "text-base font-semibold text-red-400",
  },
  outline: {
    container: "items-center rounded-xl border border-gray-700 py-4",
    text: "text-base font-semibold text-red-400",
  },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={styles.container}
      style={({ pressed }) => ({ opacity: pressed || disabled ? 0.7 : 1 })}
    >
      <Text className={styles.text}>{label}</Text>
    </Pressable>
  );
}
