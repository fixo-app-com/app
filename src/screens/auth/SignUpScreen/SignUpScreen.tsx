import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../../navigation/RootNavigator";
import {
  signUpWithEmail,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";
import { ENABLE_SOCIAL_LOGIN } from "../../../constants/features";
import { Button, Input } from "../../../design-system";
import { AuthFooterLink, SocialLoginButtons } from "../../../components";
import { useSocialAuth } from "../../../hooks/useSocialAuth";
import splashIcon from "../../../../assets/splash-icon.png";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = NativeStackScreenProps<AuthStackParamList, "SignUp">;

export default function SignUpScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    handleGoogleAuth,
    handleAppleAuth,
    loadingAction,
    setLoadingAction,
    isLoading,
  } = useSocialAuth();

  const passwordRules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const allRulesMet = passwordRules.every((r) => r.met);

  async function handleSignUp() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!allRulesMet) {
      Alert.alert("Error", "Please meet all password requirements.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoadingAction("email");
    try {
      await signUpWithEmail(email.trim(), password);
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      Alert.alert("Error", getFirebaseAuthErrorMessage(code));
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
        <View className="mb-4">
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            autoComplete="new-password"
            editable={!isLoading}
          />
        </View>

        {/* Confirm password input */}
        <View className="mb-8">
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry
            autoComplete="new-password"
            editable={!isLoading}
          />
        </View>

        {/* Sign up button */}
        <View className="mb-4">
          <Button
            label="Sign Up"
            onPress={handleSignUp}
            loading={loadingAction === "email"}
          />
        </View>

        {/* Password rules checklist */}
        {password.length > 0 && (
          <View className="mb-6">
            {passwordRules.map((rule) => (
              <View key={rule.label} className="flex-row items-center py-0.5">
                <Ionicons
                  name={rule.met ? "checkmark-circle" : "ellipse-outline"}
                  size={14}
                  color={rule.met ? "#10b981" : "#9ca3af"}
                />
                <Text
                  className={`ml-2 text-xs ${rule.met ? "text-gray-400" : "text-gray-500"}`}
                  style={
                    rule.met
                      ? { textDecorationLine: "line-through" }
                      : undefined
                  }
                >
                  {rule.label}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Social login */}
        {ENABLE_SOCIAL_LOGIN && (
          <SocialLoginButtons
            onApplePress={handleAppleAuth}
            onGooglePress={handleGoogleAuth}
            loadingAction={loadingAction}
            isLoading={isLoading}
          />
        )}

        {/* Sign in link */}
        <AuthFooterLink
          message={"Already have an account? "}
          linkText="Sign In"
          onPress={() => navigation.navigate("SignIn")}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
