import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../navigation/RootNavigator";
import { resetPassword, getFirebaseAuthErrorMessage } from "../../../services/auth";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgotPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      Alert.alert("Error", getFirebaseAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <View className="flex-1 justify-center bg-gray-950 px-8">
        <Text className="mb-4 text-center text-4xl font-extrabold text-fixo-400">
          FIXO
        </Text>
        <Text className="mb-8 text-center text-base text-gray-300">
          We sent you an email with a link to reset your password. Check your
          inbox.
        </Text>
        <Pressable
          onPress={() => navigation.navigate("SignIn")}
          className="items-center rounded-xl bg-fixo-600 py-4"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Text className="text-base font-semibold text-white">
            Back to login
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-950"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <Text className="mb-4 text-center text-4xl font-extrabold text-fixo-400">
          FIXO
        </Text>

        <Text className="mb-8 text-center text-base text-gray-400">
          Enter your email to receive a password reset link.
        </Text>

        {/* Email input */}
        <TextInput
          className="mb-6 rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-base text-white"
          placeholder="Email"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!isLoading}
        />

        {/* Reset password button */}
        <Pressable
          onPress={handleResetPassword}
          disabled={isLoading}
          className="mb-6 items-center rounded-xl bg-fixo-600 py-4"
          style={({ pressed }) => ({ opacity: pressed || isLoading ? 0.7 : 1 })}
        >
          <Text className="text-base font-semibold text-white">
            {isLoading ? "Sending..." : "Send reset link"}
          </Text>
        </Pressable>

        {/* Back to sign in */}
        <Pressable
          onPress={() => navigation.navigate("SignIn")}
          className="items-center"
          disabled={isLoading}
        >
          <Text className="text-sm text-fixo-400">Back to login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
