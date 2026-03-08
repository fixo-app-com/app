import { useMemo } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { Expense, Wallet } from "../../../types/firestore";
import { getDisplayAmountCents, roundToUnit } from "../../../types/firestore";
import { Card, SectionHeader } from "../../../design-system";
import { BankIcon, CurrencyText } from "../../../components";
import type { ViewMode } from "../../../contexts/DataContext";

interface WalletBreakdownCardProps {
  wallets: Wallet[];
  expenses: Expense[];
  viewMode: ViewMode;
}

export function WalletBreakdownCard({
  wallets,
  expenses,
  viewMode,
}: WalletBreakdownCardProps) {
  const { t } = useTranslation();

  const walletSpend = useMemo(() => {
    const spendMap: Record<string, number> = {};
    for (const e of expenses) {
      spendMap[e.walletId] =
        (spendMap[e.walletId] ?? 0) + getDisplayAmountCents(e, viewMode);
    }

    return wallets
      .map((w) => ({
        wallet: w,
        totalCents: roundToUnit(spendMap[w.id] ?? 0),
      }))
      .filter((item) => item.totalCents > 0)
      .sort((a, b) => b.totalCents - a.totalCents);
  }, [wallets, expenses, viewMode]);

  if (walletSpend.length === 0) return null;

  const maxCents = walletSpend[0].totalCents;

  return (
    <View testID="wallet-breakdown">
      <SectionHeader title={t("home.walletBreakdown")} />
      <Card>
        {walletSpend.map(({ wallet, totalCents }, index) => {
          const pct = maxCents > 0 ? (totalCents / maxCents) * 100 : 0;
          return (
            <View key={wallet.id}>
              {index > 0 && <View className="h-px bg-gray-100" />}
              <View
                className={`${
                  index === 0
                    ? "pb-3"
                    : index === walletSpend.length - 1
                      ? "pt-3"
                      : "py-3"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="mr-3 flex-row items-center flex-1">
                    <BankIcon bankKey={wallet.icon} size={28} />
                    <Text
                      className="ml-2 flex-1 text-sm font-medium text-gray-900"
                      numberOfLines={1}
                    >
                      {wallet.name}
                    </Text>
                  </View>
                  <CurrencyText
                    cents={totalCents}
                    className="text-sm font-semibold text-gray-900"
                  />
                </View>
                <View className="mt-2 h-1.5 rounded-full bg-gray-100">
                  <View
                    className="h-1.5 rounded-full bg-fixo-400"
                    style={{ width: `${pct}%` }}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </Card>
    </View>
  );
}
