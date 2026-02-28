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
import Ionicons from "@expo/vector-icons/Ionicons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../navigation/RootNavigator";
import {
  signInWithEmail,
  signInWithGoogle,
  linkGoogleToEmailAccount,
  checkEmailExists,
  resetPassword,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";
import { ENABLE_SOCIAL_LOGIN } from "../../../constants/features";
import { Button, Input } from "../../../design-system";
import splashIcon from "../../../../assets/splash-icon.png";

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
        await linkGoogleToEmailAccount(email.trim(), password, pendingGoogleIdToken);
        Alert.alert("Success", "Google account linked successfully!");
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";

      if (code === "auth/invalid-credential") {
        try {
          const exists = await checkEmailExists(email.trim());
          if (!exists) {
            Alert.alert(
              "Account not found",
              "No account is registered with this email. Would you like to create one?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Up",
                  onPress: () => navigation.navigate("SignUp"),
                },
              ],
            );
          } else {
            Alert.alert(
              "Incorrect password",
              "The password you entered is incorrect.",
              [
                { text: "Try again", style: "cancel" },
                {
                  text: "Reset password",
                  onPress: () => {
                    resetPassword(email.trim());
                    Alert.alert(
                      "Email sent",
                      "Check your inbox for a password reset link.",
                    );
                  },
                },
              ],
            );
          }
        } catch {
          Alert.alert("Error", getFirebaseAuthErrorMessage(code));
        }
      } else {
        Alert.alert("Error", getFirebaseAuthErrorMessage(code));
      }
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
      if (
        firebaseError.code === "auth/account-exists-with-different-credential"
      ) {
        Alert.alert(
          "Existing account",
          "An account with this email already exists. Sign in with your password to link Google.",
        );
        return;
      }
      if ((error as Error).message !== "Google Sign-In was cancelled") {
        Alert.alert(
          "Error",
          getFirebaseAuthErrorMessage(firebaseError.code ?? ""),
        );
      }
    } finally {
      setIsLoading(false);
    }
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
          className="mb-12 h-20 w-20 self-center"
          resizeMode="contain"
          testID="logo"
        />

        {ENABLE_SOCIAL_LOGIN && pendingGoogleIdToken && (
          <View className="mb-4 rounded-lg bg-fixo-100 p-3">
            <Text className="text-center text-sm text-fixo-600">
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
          <Text className="text-sm text-fixo-500">Forgot password?</Text>
        </Pressable>

        {/* Sign in button */}
        <View className={ENABLE_SOCIAL_LOGIN ? "mb-4" : "mb-8"}>
          <Button label="Sign In" onPress={handleSignIn} loading={isLoading} />
        </View>

        {/* Social login */}
        {ENABLE_SOCIAL_LOGIN && !pendingGoogleIdToken && (
          <>
            <View className="mb-4 flex-row items-center">
              <View className="h-px flex-1 bg-gray-300" />
              <Text className="mx-4 text-sm text-gray-400">or</Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            {/* Google Sign-In button */}
            <View className="mb-8">
              <Pressable
                onPress={handleGoogleSignIn}
                disabled={isLoading}
                className="flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-3.5"
                style={({ pressed }) => ({
                  opacity: pressed || isLoading ? 0.7 : 1,
                })}
              >
                <Ionicons name="logo-google" size={18} color="#4285F4" />
                <Text className="ml-2 text-base font-semibold text-gray-700">
                  Continue with Google
                </Text>
              </Pressable>
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
            <Text className="text-sm font-semibold text-fixo-500">Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
