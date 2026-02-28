import { Text } from "react-native";
import { useData } from "../../contexts/DataContext";
import { getCurrencySymbol } from "../../constants/banks";

interface CurrencyTextProps {
  cents: number;
  className?: string;
  hideDecimals?: boolean;
}

export function CurrencyText({ cents, className, hideDecimals }: CurrencyTextProps) {
  const { currency } = useData();
  const symbol = getCurrencySymbol(currency);

  return (
    <Text className={className}>
      {symbol}
      {hideDecimals ? Math.floor(cents / 100) : (cents / 100).toFixed(2)}
    </Text>
  );
}
