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
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../navigation/RootNavigator";
import {
  signInWithEmail,
  linkGoogleToEmailAccount,
  resetPassword,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";
import { ENABLE_SOCIAL_LOGIN } from "../../../constants/features";
import { Button, Input } from "../../../design-system";
import { AuthFooterLink, SocialLoginButtons } from "../../../components";
import { useSocialAuth } from "../../../hooks/useSocialAuth";
import splashIcon from "../../../../assets/splash-icon.png";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

export default function SignInScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pendingGoogleIdToken = route.params?.pendingGoogleIdToken;

  const {
    handleGoogleAuth,
    handleAppleAuth,
    loadingAction,
    setLoadingAction,
    isLoading,
  } = useSocialAuth();

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setLoadingAction("email");
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
        Alert.alert(
          "Invalid email or password",
          "Please check your credentials and try again.",
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
      } else {
        Alert.alert("Error", getFirebaseAuthErrorMessage(code));
      }
    } finally {
      setLoadingAction(null);
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
          <Button label="Sign In" onPress={handleSignIn} loading={loadingAction === "email"} />
        </View>

        {/* Social login */}
        {ENABLE_SOCIAL_LOGIN && !pendingGoogleIdToken && (
          <SocialLoginButtons
            onApplePress={handleAppleAuth}
            onGooglePress={handleGoogleAuth}
            loadingAction={loadingAction}
            isLoading={isLoading}
          />
        )}

        {/* Sign up link */}
        <AuthFooterLink
          message={"Don't have an account? "}
          linkText="Sign Up"
          onPress={() => navigation.navigate("SignUp")}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
