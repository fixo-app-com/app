import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../navigation/RootNavigator";
import {
  resetPassword,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";
import { Button, Input } from "../../../design-system";
import splashIcon from "../../../../assets/splash-icon.png";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert(t("common.error"), t("auth.enterEmail"));
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      Alert.alert(t("common.error"), getFirebaseAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <View className="flex-1 justify-center bg-gray-100 px-8">
        <Image
          source={splashIcon}
          className="mb-4 h-20 w-20 self-center"
          resizeMode="contain"
          testID="logo"
        />
        <Text className="mb-8 text-center text-base text-gray-600">
          {t("auth.resetEmailSent")}
        </Text>
        <Button
          label={t("auth.backToLogin")}
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <Image
          source={splashIcon}
          className="mb-4 h-20 w-20 self-center"
          resizeMode="contain"
          testID="logo"
        />

        <Text className="mb-8 text-center text-base text-gray-400">
          {t("auth.enterEmailForReset")}
        </Text>

        {/* Email input */}
        <View className="mb-6">
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder={t("auth.email")}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!isLoading}
          />
        </View>

        {/* Reset password button */}
        <View className="mb-6">
          <Button
            label={t("auth.sendResetLink")}
            onPress={handleResetPassword}
            loading={isLoading}
          />
        </View>

        {/* Back to sign in */}
        <Pressable
          onPress={() => navigation.navigate("SignIn")}
          className="items-center"
          disabled={isLoading}
        >
          <Text className="text-sm text-fixo-500">{t("auth.backToLogin")}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
