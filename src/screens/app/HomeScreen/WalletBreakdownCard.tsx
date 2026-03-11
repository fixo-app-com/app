import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader } from "../../../design-system";
import { BankIcon, CurrencyText } from "../../../components";
import type { WalletSpend } from "../../../hooks/useBudgetSummary";

interface WalletBreakdownCardProps {
  walletSpend: WalletSpend[];
}

export function WalletBreakdownCard({ walletSpend }: WalletBreakdownCardProps) {
  const { t } = useTranslation();

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
