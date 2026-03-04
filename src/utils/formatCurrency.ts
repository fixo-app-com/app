interface FormatAmountOptions {
  hideDecimals?: boolean;
  suffixFormat?: boolean;
  symbol?: string;
}

/**
 * Formats an amount in cents using dot as thousand separator and comma as decimal separator.
 *
 * Examples (symbol = "€"):
 *   formatAmount(1234567)           → "€12.345,67"
 *   formatAmount(1234567, { suffixFormat: true }) → "12.345 €"
 *   formatAmount(1234567, { hideDecimals: true }) → "€12.345"
 *   formatAmount(-50000)            → "-€500,00"
 */
export function formatAmount(
  cents: number,
  options: FormatAmountOptions = {},
): string {
  const { hideDecimals = false, suffixFormat = false, symbol = "" } = options;

  const negative = cents < 0;
  const absCents = Math.abs(cents);
  const wholePart = Math.floor(absCents / 100);
  const decimalPart = absCents % 100;

  // Format whole part with dot separators
  const wholeStr = formatWithDotSeparator(wholePart);

  const sign = negative ? "-" : "";

  if (suffixFormat) {
    return `${sign}${wholeStr}${symbol ? ` ${symbol}` : ""}`;
  }

  if (hideDecimals) {
    return `${sign}${symbol}${wholeStr}`;
  }

  const decimalStr = decimalPart.toString().padStart(2, "0");
  return `${sign}${symbol}${wholeStr},${decimalStr}`;
}

function formatWithDotSeparator(n: number): string {
  const str = n.toString();
  if (str.length <= 3) return str;

  let result = "";
  let count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      result = "." + result;
    }
    result = str[i] + result;
    count++;
  }
  return result;
}
