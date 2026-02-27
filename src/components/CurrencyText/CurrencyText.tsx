import { Text } from "react-native";

interface CurrencyTextProps {
  cents: number;
  className?: string;
}

export function CurrencyText({ cents, className }: CurrencyTextProps) {
  return (
    <Text className={className}>
      {"\u20AC"}
      {(cents / 100).toFixed(2)}
    </Text>
  );
}
