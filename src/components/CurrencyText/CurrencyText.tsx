import { Text } from "react-native";
import { useData } from "../../contexts/DataContext";
import { getCurrencySymbol } from "../../constants/banks";
import { formatAmount } from "../../utils/formatCurrency";

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

  const text = formatAmount(cents, {
    hideDecimals,
    suffixFormat,
    symbol,
  });

  return <Text className={className}>{text}</Text>;
}
