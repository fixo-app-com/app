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
import {
  signInWithEmail,
  signInWithGoogle,
  linkGoogleToEmailAccount,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export default function SignInScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pendingGoogleIdToken = route.params?.pendingGoogleIdToken;

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      if (pendingGoogleIdToken) {
        await linkGoogleToEmailAccount(email, password, pendingGoogleIdToken);
        Alert.alert("Success", "Google account linked successfully!");
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      Alert.alert("Error", getFirebaseAuthErrorMessage(code));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      const firebaseError = error as { code?: string };
      if (firebaseError.code === "auth/account-exists-with-different-credential") {
        Alert.alert(
          "Existing account",
          "An account with this email already exists. Sign in with your password to link Google.",
        );
        return;
      }
      if ((error as Error).message !== "Google Sign-In was cancelled") {
        Alert.alert("Error", getFirebaseAuthErrorMessage(firebaseError.code ?? ""));
      }
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

        {pendingGoogleIdToken && (
          <View className="mb-4 rounded-lg bg-fixo-950 p-3">
            <Text className="text-center text-sm text-fixo-300">
              Sign in with your password to link your Google account.
            </Text>
          </View>
        )}

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
          className="mb-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-4 text-base text-white"
          placeholder="Password"
          placeholderTextColor="#64748b"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          editable={!isLoading}
        />

        {/* Forgot password link */}
        <Pressable
          onPress={() => navigation.navigate("ForgotPassword")}
          className="mb-6 self-end"
          disabled={isLoading}
        >
          <Text className="text-sm text-fixo-400">Forgot password?</Text>
        </Pressable>

        {/* Sign in button */}
        <Pressable
          onPress={handleSignIn}
          disabled={isLoading}
          className="mb-4 items-center rounded-xl bg-fixo-600 py-4"
          style={({ pressed }) => ({ opacity: pressed || isLoading ? 0.7 : 1 })}
        >
          <Text className="text-base font-semibold text-white">
            {isLoading ? "Signing in..." : "Sign In"}
          </Text>
        </Pressable>

        {/* Divider */}
        {!pendingGoogleIdToken && (
          <>
            <View className="mb-4 flex-row items-center">
              <View className="h-px flex-1 bg-gray-700" />
              <Text className="mx-4 text-sm text-gray-500">or</Text>
              <View className="h-px flex-1 bg-gray-700" />
            </View>

            {/* Google Sign-In button */}
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              className="mb-8 items-center rounded-xl border border-gray-700 bg-gray-900 py-4"
              style={({ pressed }) => ({
                opacity: pressed || isLoading ? 0.7 : 1,
              })}
            >
              <Text className="text-base font-semibold text-white">
                Sign in with Google
              </Text>
            </Pressable>
          </>
        )}

        {/* Sign up link */}
        <View className="flex-row justify-center">
          <Text className="text-sm text-gray-400">
            {"Don't have an account? "}
          </Text>
          <Pressable
            onPress={() => navigation.navigate("SignUp")}
            disabled={isLoading}
          >
            <Text className="text-sm font-semibold text-fixo-400">
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
