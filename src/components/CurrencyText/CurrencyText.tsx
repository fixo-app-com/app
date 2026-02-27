import { Text } from "react-native";
import { useData } from "../../contexts/DataContext";
import { getCurrencySymbol } from "../../constants/banks";

interface CurrencyTextProps {
  cents: number;
  className?: string;
}

export function CurrencyText({ cents, className }: CurrencyTextProps) {
  const { currency } = useData();
  const symbol = getCurrencySymbol(currency);

  return (
    <Text className={className}>
      {symbol}
      {(cents / 100).toFixed(2)}
    </Text>
  );
}
