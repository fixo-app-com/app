import { useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Svg, Path, G } from "react-native-svg";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NavigationProp } from "@react-navigation/native";
import type { AppRootStackParamList } from "../../../navigation/RootNavigator";
import type { Category, Expense, Wallet } from "../../../types/firestore";
import { Button, Card, SectionHeader } from "../../../design-system";

interface Props {
  categories: Category[];
  expenses: Expense[];
  wallets: Wallet[];
  navigation: NavigationProp<AppRootStackParamList>;
}

/* ── Breakdown ghost (mirrors DonutChart) ──────────────────────────── */

const GHOST_SEGMENTS = [
  { color: "#a5b4fc", fraction: 0.45 }, // indigo-300
  { color: "#c4b5fd", fraction: 0.3 }, // violet-300
  { color: "#93c5fd", fraction: 0.25 }, // blue-300
];

const CHART_INSET = 32;
const GAP = 0.02;

function describeArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const cosStart = Math.cos(startAngle);
  const sinStart = Math.sin(startAngle);
  const cosEnd = Math.cos(endAngle);
  const sinEnd = Math.sin(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return [
    `M ${cx + outerR * cosStart} ${cy + outerR * sinStart}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${cx + outerR * cosEnd} ${cy + outerR * sinEnd}`,
    `L ${cx + innerR * cosEnd} ${cy + innerR * sinEnd}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${cx + innerR * cosStart} ${cy + innerR * sinStart}`,
    "Z",
  ].join(" ");
}

function GhostDonut() {
  const [containerWidth, setContainerWidth] = useState(0);

  function handleLayout(e: LayoutChangeEvent) {
    setContainerWidth(e.nativeEvent.layout.width);
  }

  if (containerWidth === 0) {
    return <View onLayout={handleLayout} style={{ height: 1 }} />;
  }

  const chartSize = containerWidth - CHART_INSET * 2;
  const cx = chartSize / 2;
  const cy = chartSize / 2;
  const outerR = chartSize / 2 - 4;
  const innerR = outerR * 0.6;

  const totalGap = GAP * GHOST_SEGMENTS.length;
  const available = Math.PI * 2 - totalGap;
  let currentAngle = -Math.PI / 2;

  const arcs = GHOST_SEGMENTS.map((seg, i) => {
    const sweep = seg.fraction * available;
    const startAngle = currentAngle + GAP / 2;
    const endAngle = startAngle + sweep;
    currentAngle = endAngle + GAP / 2;
    return {
      key: i,
      d: describeArc(cx, cy, outerR, innerR, startAngle, endAngle),
      color: seg.color,
    };
  });

  return (
    <View onLayout={handleLayout} style={{ alignItems: "center" }}>
      <View style={{ width: chartSize, height: chartSize }}>
        <Svg width={chartSize} height={chartSize}>
          <G>
            {arcs.map((arc) => (
              <Path key={arc.key} d={arc.d} fill={arc.color} />
            ))}
          </G>
        </Svg>
        <View
          style={{
            position: "absolute",
            top: cy - innerR * 0.5,
            left: cx - innerR * 0.7,
            width: innerR * 1.4,
            height: innerR,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View className="h-3 w-12 rounded bg-gray-200" />
          <View className="mt-1.5 h-5 w-16 rounded bg-gray-200" />
        </View>
      </View>
    </View>
  );
}

/* ── Wallet ghost row (mirrors WalletBreakdownCard) ────────────────── */

const GHOST_WALLETS = [
  { abbr: "R", color: "#000000", name: "Revolut", pct: 100 },
  { abbr: "N", color: "#36a18b", name: "N26", pct: 60 },
];

/* ── Main component ────────────────────────────────────────────────── */

export function GettingStartedCards({
  categories,
  expenses,
  wallets,
  navigation,
}: Props) {
  const { t } = useTranslation();

  const showCategories = categories.length === 0;
  const showExpenses = expenses.length === 0;
  const showWallets = wallets.length === 0;

  return (
    <View className="gap-6">
      {/* ── Breakdown ghost (DonutChart replica) ── */}
      {showCategories && (
        <View>
          <SectionHeader title={t("home.breakdown")} />
          <Card>
            <View className="opacity-40">
              <GhostDonut />
            </View>
            <View className="mt-4">
              <Button
                label={t("home.addFirstCategory")}
                variant="outline"
                onPress={() => navigation.navigate("AddEditCategory", {})}
              />
            </View>
          </Card>
        </View>
      )}

      {/* ── Wallets ghost (WalletBreakdownCard replica) ── */}
      {showWallets && (
        <View>
          <SectionHeader title={t("home.walletBreakdown")} />
          <Card>
            <View className="opacity-40">
              {GHOST_WALLETS.map((w, index) => (
                <View key={w.abbr}>
                  {index > 0 && <View className="h-px bg-gray-100" />}
                  <View
                    className={`${
                      index === 0
                        ? "pb-3"
                        : index === GHOST_WALLETS.length - 1
                          ? "pt-3"
                          : "py-3"
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="mr-3 flex-row items-center flex-1">
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: w.color,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 28 * 0.38,
                              fontWeight: "700",
                              color: "#fff",
                            }}
                          >
                            {w.abbr}
                          </Text>
                        </View>
                        <Text
                          className="ml-2 flex-1 text-sm font-medium text-gray-900"
                          numberOfLines={1}
                        >
                          {w.name}
                        </Text>
                      </View>
                      <View className="h-3.5 w-14 rounded bg-gray-200" />
                    </View>
                    <View className="mt-2 h-1.5 rounded-full bg-gray-100">
                      <View
                        className="h-1.5 rounded-full bg-fixo-400"
                        style={{ width: `${w.pct}%` }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View className="mt-4">
              <Button
                label={t("home.addFirstWallet")}
                variant="outline"
                onPress={() => navigation.navigate("AddEditWallet", {})}
              />
            </View>
          </Card>
        </View>
      )}

      {/* ── Emergency fund ghost (EmergencyFundMiniCard replica) ── */}
      {showExpenses && (
        <View>
          <SectionHeader title={t("home.emergencyFund")} />
          <Card>
            <View className="opacity-40">
              <View className="flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                  <Ionicons name="shield-checkmark" size={20} color="#818cf8" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {t("home.emergencyTarget")}
                  </Text>
                  <View className="mt-0.5 h-5 w-20 rounded bg-gray-200" />
                  <View className="mt-1 h-3 w-32 rounded bg-gray-100" />
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </View>
            </View>
            <View className="mt-4">
              <Button
                label={t("home.addFirstExpense")}
                variant="outline"
                onPress={() => {
                  if (categories.length > 0) {
                    navigation.navigate("AddEditExpense", {
                      categoryId: categories[0].id,
                    });
                  } else {
                    navigation.navigate("MainTabs", {
                      screen: "CategoriesTab",
                    });
                  }
                }}
              />
            </View>
          </Card>
        </View>
      )}
    </View>
  );
}
