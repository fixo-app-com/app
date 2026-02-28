import { Text } from "react-native";
import { useData } from "../../contexts/DataContext";
import { getCurrencySymbol } from "../../constants/banks";

interface CurrencyTextProps {
  cents: number;
  className?: string;
  hideDecimals?: boolean;
  /** Symbol after number, no decimals, thousand separators (e.g. "1.200 €") */
  suffixFormat?: boolean;
}

export function CurrencyText({
  cents,
  className,
  hideDecimals,
  suffixFormat,
}: CurrencyTextProps) {
  const { currency } = useData();
  const symbol = getCurrencySymbol(currency);

  if (suffixFormat) {
    return (
      <Text className={className}>
        {Math.floor(cents / 100).toLocaleString()} {symbol}
      </Text>
    );
  }

  return (
    <Text className={className}>
      {symbol}
      {hideDecimals ? Math.floor(cents / 100) : (cents / 100).toFixed(2)}
    </Text>
  );
}
