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
import { signUpWithEmail, getFirebaseAuthErrorMessage } from "../../../services/auth";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      Alert.alert("Error", getFirebaseAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-950"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo */}
        <Text className="mb-12 text-center text-4xl font-extrabold text-fixo-400">
          FIXO
        </Text>

        {/* Email input */}
        <TextInput
          className="mb-4 rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-base text-white"
          placeholder="Email"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          editable={!isLoading}
        />

        {/* Password input */}
        <TextInput
          className="mb-4 rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-base text-white"
          placeholder="Password"
          placeholderTextColor="#64748b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          editable={!isLoading}
        />

        {/* Confirm password input */}
        <TextInput
          className="mb-8 rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-base text-white"
          placeholder="Confirm password"
          placeholderTextColor="#64748b"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete="new-password"
          editable={!isLoading}
        />

        {/* Sign up button */}
        <Pressable
          onPress={handleSignUp}
          disabled={isLoading}
          className="mb-8 items-center rounded-xl bg-fixo-600 py-4"
          style={({ pressed }) => ({ opacity: pressed || isLoading ? 0.7 : 1 })}
        >
          <Text className="text-base font-semibold text-white">
            {isLoading ? "Signing up..." : "Sign Up"}
          </Text>
        </Pressable>

        {/* Sign in link */}
        <View className="flex-row justify-center">
          <Text className="text-sm text-gray-400">
            {"Already have an account? "}
          </Text>
          <Pressable
            onPress={() => navigation.navigate("SignIn")}
            disabled={isLoading}
          >
            <Text className="text-sm font-semibold text-fixo-400">
              Sign In
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
