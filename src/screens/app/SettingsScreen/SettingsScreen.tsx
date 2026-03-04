import { useState } from "react";
import { Alert, Linking, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { signOut, deleteAccount } from "../../../services/auth";
import { CURRENCIES } from "../../../constants/banks";
import {
  Button,
  ChipGroup,
  FormRow,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";

export default function SettingsScreen() {
  const { user } = useAuth();
  const { currency, setCurrency } = useData();
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDeleteAccount() {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAccount();
            } catch (error) {
              const code = (error as { code?: string }).code ?? "";
              Alert.alert(
                "Error",
                code === "auth/requires-recent-login"
                  ? "For security, please sign out and sign back in before deleting your account."
                  : "Failed to delete account. Please try again.",
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }

  const headerContent = (
    <Text className="mb-6 text-3xl font-bold text-gray-900">Settings</Text>
  );

  return (
    <ScreenWrapper scroll header={headerContent}>
      <SectionHeader title="Account" />

      <FormRow
        label="Email"
        first
        last
        right={
          <Text className="text-base text-gray-500">{user?.email ?? "—"}</Text>
        }
      />

      <SectionHeader title="Currency" />

      <ChipGroup
        options={CURRENCIES.map((c) => ({
          value: c.code,
          label: `${c.symbol} ${c.code}`,
        }))}
        selected={currency}
        onSelect={setCurrency}
        compact
      />

      <SectionHeader title="Legal" />

      <FormRow
        label="Privacy Policy"
        first
        onPress={() => Linking.openURL("https://www.fixo-app.com/privacy")}
        right={<Ionicons name="chevron-forward" size={16} color="#9ca3af" />}
      />
      <FormRow
        label="Terms of Service"
        onPress={() => Linking.openURL("https://www.fixo-app.com/terms")}
        right={<Ionicons name="chevron-forward" size={16} color="#9ca3af" />}
      />
      <FormRow
        label="Support"
        last
        onPress={() => Linking.openURL("https://www.fixo-app.com/support")}
        right={<Ionicons name="chevron-forward" size={16} color="#9ca3af" />}
      />

      <View className="flex-1" />

      <View className="mt-6 pb-4">
        <Button label="Sign out" variant="secondary" onPress={() => signOut()} />

        <View className="mt-3">
          <Button
            label="Delete Account"
            variant="destructive"
            onPress={handleDeleteAccount}
            loading={isDeleting}
          />
        </View>

        <Text className="mt-6 text-center text-xs text-gray-400">
          Fixo v{Constants.expoConfig?.version}
        </Text>
      </View>
    </ScreenWrapper>
  );
}
