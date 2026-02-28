import { ActivityIndicator, Pressable, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "destructive";
  disabled?: boolean;
  loading?: boolean;
}

const variantStyles = {
  primary: {
    container: "items-center rounded-xl bg-fixo-500 py-3.5",
    text: "text-base font-semibold text-white",
  },
  secondary: {
    container: "items-center rounded-xl bg-gray-200 py-3.5",
    text: "text-base font-semibold text-gray-900",
  },
  destructive: {
    container: "items-center rounded-xl py-3.5",
    text: "text-base font-semibold text-red-500",
  },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
}: ButtonProps) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={styles.container}
      style={({ pressed }) => ({ opacity: pressed || isDisabled ? 0.7 : 1 })}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "destructive" ? "#ef4444" : "#ffffff"}
          size="small"
        />
      ) : (
        <Text className={styles.text}>{label}</Text>
      )}
    </Pressable>
  );
}
