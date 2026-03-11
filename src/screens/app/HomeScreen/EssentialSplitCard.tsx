import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import type { ExpensePriority } from "../../../types/firestore";
import { Card, SectionHeader } from "../../../design-system";
import { CurrencyText } from "../../../components";

interface EssentialSplitCardProps {
  essentialCents: number;
  reducibleCents: number;
  optionalCents: number;
  onPriorityPress: (priority: ExpensePriority) => void;
}

export function EssentialSplitCard({
  essentialCents,
  reducibleCents,
  optionalCents,
  onPriorityPress,
}: EssentialSplitCardProps) {
  const { t } = useTranslation();

  if (essentialCents === 0 && reducibleCents === 0 && optionalCents === 0)
    return null;

  return (
    <View testID="essential-split">
      <SectionHeader title={t("home.essentialCosts")} />
      <Card>
        <View className="flex-row items-center">
          <Pressable
            className="flex-1 items-center"
            onPress={() => onPriorityPress("essential")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <CurrencyText
              cents={essentialCents}
              className="text-xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-amber-500">
              {t("home.essential")}
            </Text>
          </Pressable>
          <View className="w-px self-stretch bg-gray-200" />
          <Pressable
            className="flex-1 items-center"
            onPress={() => onPriorityPress("reducible")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <CurrencyText
              cents={reducibleCents}
              className="text-xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-blue-500">{t("home.reducible")}</Text>
          </Pressable>
          <View className="w-px self-stretch bg-gray-200" />
          <Pressable
            className="flex-1 items-center"
            onPress={() => onPriorityPress("optional")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <CurrencyText
              cents={optionalCents}
              className="text-xl font-bold text-gray-900"
              suffixFormat
            />
            <Text className="text-xs text-gray-400">{t("home.optional")}</Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
}
