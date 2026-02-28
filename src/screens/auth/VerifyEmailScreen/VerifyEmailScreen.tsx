import { useState } from "react";
import { Alert, Text, View } from "react-native";
import auth from "@react-native-firebase/auth";
import { useAuth } from "../../../contexts/AuthContext";
import {
  resendVerificationEmail,
  signOut,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";
import { Button } from "../../../design-system";

export default function VerifyEmailScreen() {
  const { user, reloadUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  async function handleResend() {
    setIsResending(true);
    try {
      await resendVerificationEmail();
      Alert.alert("Email sent", "A new verification email has been sent.");
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      Alert.alert("Error", getFirebaseAuthErrorMessage(code));
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
          "Not verified yet",
          "Your email is not verified yet. Please check your inbox or spam folder and tap the verification link.",
        );
      }
    } catch {
      Alert.alert("Error", "Could not check verification status. Try again.");
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
        Verify your email
      </Text>

      <Text className="mb-8 text-center text-base text-gray-400">
        We sent a verification link to{"\n"}
        <Text className="text-gray-900">{user?.email}</Text>
        {"\n"}Check your inbox or spam folder and tap the link to continue.
      </Text>

      {/* Check verification button */}
      <View className="mb-4">
        <Button
          label="I've verified my email"
          onPress={handleCheckVerification}
          loading={isChecking}
        />
      </View>

      {/* Resend email button */}
      <View className="mb-4">
        <Button
          label="Resend verification email"
          variant="secondary"
          onPress={handleResend}
          loading={isResending}
        />
      </View>

      {/* Sign out button */}
      <Button
        label="Sign out"
        variant="destructive"
        onPress={() => signOut()}
      />
    </View>
  );
}
