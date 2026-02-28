export interface BankInfo {
  key: string;
  name: string;
  color: string; // brand color
  abbr: string; // 1-2 char abbreviation
}

export const BANKS: BankInfo[] = [
  {
    key: "intesa-sanpaolo",
    name: "Intesa Sanpaolo",
    color: "#007A33",
    abbr: "IS",
  },
  { key: "n26", name: "N26", color: "#36A18B", abbr: "N" },
  {
    key: "trade-republic",
    name: "Trade Republic",
    color: "#1E1E2E",
    abbr: "TR",
  },
  { key: "revolut", name: "Revolut", color: "#0075EB", abbr: "R" },
  { key: "bpm", name: "BPM", color: "#CC0000", abbr: "BP" },
  { key: "unicredit", name: "UniCredit", color: "#E2001A", abbr: "UC" },
  { key: "ing", name: "ING", color: "#FF6200", abbr: "IN" },
  { key: "deutsche-bank", name: "Deutsche Bank", color: "#0018A8", abbr: "DB" },
  { key: "fineco", name: "Fineco", color: "#006DB6", abbr: "FN" },
  { key: "mediolanum", name: "Mediolanum", color: "#003087", abbr: "ML" },
  { key: "bnp-paribas", name: "BNP Paribas", color: "#00915A", abbr: "BN" },
  {
    key: "credit-agricole",
    name: "Crédit Agricole",
    color: "#006837",
    abbr: "CA",
  },
  { key: "santander", name: "Santander", color: "#EC0000", abbr: "SA" },
  { key: "bbva", name: "BBVA", color: "#004481", abbr: "BB" },
  { key: "hsbc", name: "HSBC", color: "#DB0011", abbr: "HS" },
  { key: "barclays", name: "Barclays", color: "#00AEEF", abbr: "BA" },
  { key: "mps", name: "Monte dei Paschi", color: "#006837", abbr: "MP" },
  { key: "hype", name: "Hype", color: "#8B5CF6", abbr: "HY" },
  { key: "wise", name: "Wise", color: "#9FE870", abbr: "W" },
  { key: "paypal", name: "PayPal", color: "#003087", abbr: "PP" },
  { key: "postepay", name: "Postepay", color: "#FFD700", abbr: "PT" },
  { key: "widiba", name: "Widiba", color: "#FFC000", abbr: "WI" },
];

export function getBankByKey(key: string): BankInfo | undefined {
  return BANKS.find((b) => b.key === key);
}

/** Currencies available for selection */
export const CURRENCIES = [
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
];

export function getCurrencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}
