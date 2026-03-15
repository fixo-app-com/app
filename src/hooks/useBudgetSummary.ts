import { useMemo } from "react";
import type {
  Category,
  Expense,
  ExpensePriority,
  Wallet,
} from "../types/firestore";
import {
  computeEmergencyTarget,
  getDisplayAmountCents,
  roundToUnit,
  sumDisplayCents,
} from "../types/firestore";
import type { ViewMode } from "../contexts/DataContext";

export interface DonutSegment {
  id: string;
  name: string;
  icon: string;
  totalCents: number;
}

export interface WalletSpend {
  wallet: Wallet;
  totalCents: number;
}

export interface BudgetSummary {
  /** Sum of all display expenses, rounded to unit — THE single source of truth */
  totalCents: number;
  /** Income adjusted for view mode (monthly or yearly) */
  incomeDisplayCents: number;
  /** income − totalCents */
  availableCents: number;
  /** Monthly available (for emergency fund projection) */
  availableMonthlyCents: number;

  /** Priority splits — raw cents (display truncates decimals) */
  essentialCents: number;
  reducibleCents: number;
  optionalCents: number;

  /** Donut chart segments — raw cents per category */
  donutSegments: DonutSegment[];

  /** Wallet breakdown — raw cents per wallet */
  walletSpend: WalletSpend[];

  /** Emergency fund: monthly essential+reducible cost */
  monthlyEssentialCents: number;
  /** Emergency fund: target for N months */
  emergencyTargetCents: number;
  /** Essential+reducible expenses (for emergency detail) */
  essentialExpenses: Expense[];
}

export function useBudgetSummary({
  expenses,
  categories,
  wallets,
  monthlyIncomeCents,
  viewMode,
  emergencyMonths,
  emergencyPriorities,
}: {
  expenses: Expense[];
  categories: Category[];
  wallets: Wallet[];
  monthlyIncomeCents: number;
  viewMode: ViewMode;
  emergencyMonths: number;
  emergencyPriorities: ExpensePriority[];
}): BudgetSummary {
  return useMemo(() => {
    const isYearly = viewMode === "yearly";

    // ── Global totals (single source of truth) ──────────────────
    const totalCents = roundToUnit(sumDisplayCents(expenses, viewMode));
    const incomeDisplayCents = isYearly
      ? monthlyIncomeCents * 12
      : monthlyIncomeCents;
    const availableCents = incomeDisplayCents - totalCents;
    const availableMonthlyCents = isYearly
      ? Math.round(availableCents / 12)
      : availableCents;

    // ── Priority split ──────────────────────────────────────────
    let rawEssential = 0;
    let rawReducible = 0;
    let rawOptional = 0;
    for (const e of expenses) {
      const amount = getDisplayAmountCents(e, viewMode);
      switch (e.priority) {
        case "essential":
          rawEssential += amount;
          break;
        case "reducible":
          rawReducible += amount;
          break;
        default:
          rawOptional += amount;
          break;
      }
    }
    // Largest-remainder distribution: floor each to whole unit,
    // then distribute the deficit so the 3 values sum exactly to totalCents.
    const rawPriorities = [
      { key: "essential" as const, raw: rawEssential },
      { key: "reducible" as const, raw: rawReducible },
      { key: "optional" as const, raw: rawOptional },
    ];
    const distributed = rawPriorities.map((p) => ({
      key: p.key,
      value: Math.floor(p.raw / 100) * 100,
      remainder: p.raw % 100,
    }));
    let deficit = totalCents - distributed.reduce((s, p) => s + p.value, 0);
    distributed.sort((a, b) => b.remainder - a.remainder);
    for (const p of distributed) {
      if (deficit >= 100) {
        p.value += 100;
        deficit -= 100;
      }
    }
    const find = (k: string) => distributed.find((p) => p.key === k)!.value;
    const essentialCents = find("essential");
    const reducibleCents = find("reducible");
    const optionalCents = find("optional");

    // ── Donut segments (per category) ───────────────────────────
    const catMap: Record<string, number> = {};
    for (const e of expenses) {
      catMap[e.categoryId] =
        (catMap[e.categoryId] ?? 0) + getDisplayAmountCents(e, viewMode);
    }
    const donutSegments: DonutSegment[] = categories
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        totalCents: catMap[cat.id] ?? 0,
      }))
      .filter((s) => s.totalCents > 0);

    // ── Wallet breakdown ────────────────────────────────────────
    const walletMap: Record<string, number> = {};
    for (const e of expenses) {
      walletMap[e.walletId] =
        (walletMap[e.walletId] ?? 0) + getDisplayAmountCents(e, viewMode);
    }
    const walletSpend: WalletSpend[] = wallets
      .map((w) => ({
        wallet: w,
        totalCents: walletMap[w.id] ?? 0,
      }))
      .filter((item) => item.totalCents > 0)
      .sort((a, b) => b.totalCents - a.totalCents);

    // ── Emergency fund ──────────────────────────────────────────
    const essentialExpenses = expenses.filter((e) =>
      emergencyPriorities.includes(e.priority),
    );
    const { monthlyEssentialCents, targetCents: emergencyTargetCents } =
      computeEmergencyTarget(expenses, emergencyMonths, emergencyPriorities);

    return {
      totalCents,
      incomeDisplayCents,
      availableCents,
      availableMonthlyCents,
      essentialCents,
      reducibleCents,
      optionalCents,
      donutSegments,
      walletSpend,
      monthlyEssentialCents,
      emergencyTargetCents,
      essentialExpenses,
    };
  }, [
    expenses,
    categories,
    wallets,
    monthlyIncomeCents,
    viewMode,
    emergencyMonths,
    emergencyPriorities,
  ]);
}
