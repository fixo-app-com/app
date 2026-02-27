import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
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
import { Button, Input } from "../../../design-system";

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
        <View className="mb-4">
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!isLoading}
          />
        </View>

        {/* Password input */}
        <View className="mb-2">
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            autoComplete="password"
            editable={!isLoading}
          />
        </View>

        {/* Forgot password link */}
        <Pressable
          onPress={() => navigation.navigate("ForgotPassword")}
          className="mb-6 self-end"
          disabled={isLoading}
        >
          <Text className="text-sm text-fixo-400">Forgot password?</Text>
        </Pressable>

        {/* Sign in button */}
        <View className="mb-4">
          <Button
            label="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
          />
        </View>

        {/* Divider */}
        {!pendingGoogleIdToken && (
          <>
            <View className="mb-4 flex-row items-center">
              <View className="h-px flex-1 bg-gray-700" />
              <Text className="mx-4 text-sm text-gray-500">or</Text>
              <View className="h-px flex-1 bg-gray-700" />
            </View>

            {/* Google Sign-In button */}
            <View className="mb-8">
              <Button
                label="Sign in with Google"
                variant="secondary"
                onPress={handleGoogleSignIn}
                disabled={isLoading}
              />
            </View>
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
