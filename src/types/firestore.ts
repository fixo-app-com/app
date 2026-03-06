export interface Category {
  id: string;
  name: string; // "Famiglia", "Auto", etc.
  icon: string; // emoji
  createdAt: Date;
}

export type BillingFrequency = "monthly" | "yearly";

export interface Expense {
  id: string;
  categoryId: string;
  name: string; // "Netflix", "Assicurazione"
  amountCents: number; // 1299 = €12.99
  billingFrequency: BillingFrequency; // "monthly" | "yearly"
  walletId: string;
  essential: boolean; // "costo fisso" flag
  notes: string;
  createdAt: Date;
}

/** Returns the monthly equivalent in cents (precise to the cent). */
function getMonthlyAmountCents(
  expense: Pick<Expense, "amountCents" | "billingFrequency">,
): number {
  if (expense.billingFrequency === "yearly") {
    return Math.round(expense.amountCents / 12);
  }
  return expense.amountCents;
}

/** Returns the display amount in cents based on the active view mode. */
export function getDisplayAmountCents(
  expense: Pick<Expense, "amountCents" | "billingFrequency">,
  viewMode: "monthly" | "yearly",
): number {
  if (viewMode === "yearly") {
    return expense.billingFrequency === "yearly"
      ? expense.amountCents
      : expense.amountCents * 12;
  }
  return getMonthlyAmountCents(expense);
}

/** Rounds cents to the nearest whole unit (≥ .30 → up, < .30 → down). Use on category/wallet totals. */
export function roundToUnit(cents: number): number {
  const remainder = Math.abs(cents) % 100;
  const base = Math.trunc(cents / 100) * 100;
  return remainder >= 30 ? base + Math.sign(cents) * 100 : base;
}

/** Sums getDisplayAmountCents for all expenses without rounding. */
export function sumDisplayCents(
  expenses: Pick<Expense, "amountCents" | "billingFrequency">[],
  viewMode: "monthly" | "yearly",
): number {
  return expenses.reduce(
    (sum, e) => sum + getDisplayAmountCents(e, viewMode),
    0,
  );
}

/** Sums display cents and rounds to the nearest whole unit. */
export function computeTotalCents(
  expenses: Pick<Expense, "amountCents" | "billingFrequency">[],
  viewMode: "monthly" | "yearly",
): number {
  return roundToUnit(sumDisplayCents(expenses, viewMode));
}

export interface Wallet {
  id: string;
  name: string; // "Intesa Sanpaolo", "Revolut"
  icon: string; // bank key from BANKS constant, e.g. "n26", "revolut"
  createdAt: Date;
}

export type PinnedBudgetMetric = "budget" | "costs" | "available";

export type SupportedLanguage = "en" | "it" | "fr" | "de" | "es";

export interface UserSettings {
  currency: string; // ISO 4217 code, e.g. "EUR", "USD"
  monthlyBudgetCents?: number; // e.g. 250000 = €2,500.00
  emergencyMonths?: number; // slider value, default 6
  emergencySavedCents?: number; // how much user has saved
  emergencyMonthlySavingCents?: number; // monthly saving rate (for projection)
  language?: SupportedLanguage;
}
