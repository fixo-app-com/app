export type WidgetKey =
  | "overview"
  | "breakdown"
  | "essentialSplit"
  | "fixedCosts"
  | "dailyBudget"
  | "emergencyFund"
  | "topExpenses"
  | "wallets";

export const DEFAULT_WIDGET_ORDER: WidgetKey[] = [
  "overview",
  "breakdown",
  "essentialSplit",
  "fixedCosts",
  "dailyBudget",
  "emergencyFund",
  "topExpenses",
  "wallets",
];
