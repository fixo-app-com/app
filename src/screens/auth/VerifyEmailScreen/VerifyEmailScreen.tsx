import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import auth from "@react-native-firebase/auth";
import { useAuth } from "../../../contexts/AuthContext";
import {
  resendVerificationEmail,
  signOut,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";
import { Button } from "../../../design-system";

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const { user, reloadUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  async function handleResend() {
    setIsResending(true);
    try {
      await resendVerificationEmail();
      Alert.alert(t("verify.emailSentTitle"), t("verify.emailSentMessage"));
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      Alert.alert(t("common.error"), getFirebaseAuthErrorMessage(code));
    } finally {
      setIsResending(false);
    }
  }

  async function handleCheckVerification() {
    setIsChecking(true);
    try {
      await reloadUser();
      const refreshed = auth().currentUser;
      if (refreshed && !refreshed.emailVerified) {
        Alert.alert(
          t("verify.notVerifiedTitle"),
          t("verify.notVerifiedMessage"),
        );
      }
    } catch {
      Alert.alert(t("common.error"), t("verify.checkErrorMessage"));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-gray-100 px-8">
      <Text className="mb-4 text-center text-4xl font-extrabold text-fixo-500">
        FIXO
      </Text>

      <Text className="mb-2 text-center text-lg font-semibold text-gray-900">
        {t("verify.title")}
      </Text>

      <Text className="mb-8 text-center text-base text-gray-400">
        {t("verify.message", { email: user?.email })}
      </Text>

      {/* Check verification button */}
      <View className="mb-4">
        <Button
          label={t("verify.checkButton")}
          onPress={handleCheckVerification}
          loading={isChecking}
        />
      </View>

      {/* Resend email button */}
      <View className="mb-4">
        <Button
          label={t("verify.resendButton")}
          variant="secondary"
          onPress={handleResend}
          loading={isResending}
        />
      </View>

      {/* Sign out button */}
      <Button
        label={t("verify.signOut")}
        variant="destructive"
        onPress={() => signOut()}
      />
    </View>
  );
}
