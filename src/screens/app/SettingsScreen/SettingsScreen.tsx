import { useState } from "react";
import { Alert, Linking, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { signOut, deleteAccount } from "../../../services/auth";
import { CURRENCIES } from "../../../constants/banks";
import type { SupportedLanguage } from "../../../types/firestore";
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS } from "../../../i18n";
import {
  Button,
  ChipGroup,
  FormLabel,
  FormRow,
  ScreenWrapper,
} from "../../../design-system";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currency, setCurrency, language, setLanguage } = useData();
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDeleteAccount() {
    Alert.alert(
      t("settings.deleteAccountTitle"),
      t("settings.deleteAccountMessage"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
            } catch (error) {
              const code = (error as { code?: string }).code ?? "";
              Alert.alert(
                t("common.error"),
                code === "auth/requires-recent-login"
                  ? t("settings.deleteAccountRecentLogin")
                  : t("settings.deleteAccountFailed"),
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }

  return (
    <ScreenWrapper scroll title={t("settings.title")}>
      <FormLabel title={t("settings.account")} />

      <FormRow
        label={t("settings.email")}
        first
        last
        right={
          <Text className="text-base text-gray-500">
            {user?.email ?? "\u2014"}
          </Text>
        }
      />

      <View className="mt-4">
        <FormLabel title={t("settings.currency")} />
      </View>

      <ChipGroup
        options={CURRENCIES.map((c) => ({
          value: c.code,
          label: `${c.symbol} ${c.code}`,
        }))}
        selected={currency}
        onSelect={setCurrency}
        compact
      />

      <View className="mt-4">
        <FormLabel title={t("settings.language")} />
      </View>

      <ChipGroup
        options={SUPPORTED_LANGUAGES.map((lang) => ({
          value: lang,
          label: LANGUAGE_LABELS[lang],
        }))}
        selected={language}
        onSelect={(lang) => setLanguage(lang as SupportedLanguage)}
        compact
      />

      <View className="mt-4">
        <FormLabel title={t("settings.legal")} />
      </View>

      <FormRow
        label={t("settings.privacyPolicy")}
        first
        onPress={() => Linking.openURL("https://www.fixo-app.com/privacy")}
        right={<Ionicons name="chevron-forward" size={16} color="#9ca3af" />}
      />
      <FormRow
        label={t("settings.termsOfService")}
        onPress={() => Linking.openURL("https://www.fixo-app.com/terms")}
        right={<Ionicons name="chevron-forward" size={16} color="#9ca3af" />}
      />
      <FormRow
        label={t("settings.support")}
        last
        onPress={() => Linking.openURL("https://www.fixo-app.com/support")}
        right={<Ionicons name="chevron-forward" size={16} color="#9ca3af" />}
      />

      <View className="flex-1" />

      <View className="mt-14 pb-4">
        <Button
          label={t("settings.signOut")}
          variant="secondary"
          onPress={() => signOut()}
        />

        <View className="mt-3">
          <Button
            label={t("settings.deleteAccount")}
            variant="destructive"
            onPress={handleDeleteAccount}
            loading={isDeleting}
          />
        </View>

        <Text className="mt-6 text-center text-xs text-gray-400">
          {t("settings.version", { version: Constants.expoConfig?.version })}
        </Text>
      </View>
    </ScreenWrapper>
  );
}
