import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import {
  resendVerificationEmail,
  signOut,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";

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
    } catch {
      Alert.alert("Error", "Could not check verification status. Try again.");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-gray-950 px-8">
      <Text className="mb-4 text-center text-4xl font-extrabold text-fixo-400">
        FIXO
      </Text>

      <Text className="mb-2 text-center text-lg font-semibold text-white">
        Verify your email
      </Text>

      <Text className="mb-8 text-center text-base text-gray-400">
        We sent a verification link to{"\n"}
        <Text className="text-white">{user?.email}</Text>
        {"\n"}Check your inbox and tap the link to continue.
      </Text>

      {/* Check verification button */}
      <Pressable
        onPress={handleCheckVerification}
        disabled={isChecking}
        className="mb-4 items-center rounded-xl bg-fixo-600 py-4"
        style={({ pressed }) => ({
          opacity: pressed || isChecking ? 0.7 : 1,
        })}
      >
        <Text className="text-base font-semibold text-white">
          {isChecking ? "Checking..." : "I've verified my email"}
        </Text>
      </Pressable>

      {/* Resend email button */}
      <Pressable
        onPress={handleResend}
        disabled={isResending}
        className="mb-4 items-center rounded-xl border border-gray-700 py-4"
        style={({ pressed }) => ({
          opacity: pressed || isResending ? 0.7 : 1,
        })}
      >
        <Text className="text-base text-gray-300">
          {isResending ? "Sending..." : "Resend verification email"}
        </Text>
      </Pressable>

      {/* Sign out button */}
      <Pressable
        onPress={() => signOut()}
        className="items-center py-4"
      >
        <Text className="text-sm text-gray-500">Sign out</Text>
      </Pressable>
    </View>
  );
}
