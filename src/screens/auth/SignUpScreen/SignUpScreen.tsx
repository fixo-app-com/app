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
  signUpWithEmail,
  signInWithGoogle,
  getFirebaseAuthErrorMessage,
} from "../../../services/auth";
import { Button, Input } from "../../../design-system";
import splashIcon from "../../../../assets/splash-icon.png";

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

  async function handleGoogleSignUp() {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      if ((error as Error).message !== "Google Sign-In was cancelled") {
        const code = (error as { code?: string }).code ?? "";
        Alert.alert("Error", getFirebaseAuthErrorMessage(code));
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
          <Button label="Sign Up" onPress={handleSignUp} loading={isLoading} />
        </View>

        {/* Divider */}
        <View className="mb-4 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />
          <Text className="mx-4 text-sm text-gray-400">or</Text>
          <View className="h-px flex-1 bg-gray-300" />
        </View>

        {/* Google Sign-Up button */}
        <View className="mb-8">
          <Pressable
            onPress={handleGoogleSignUp}
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

        {/* Sign in link */}
        <View className="flex-row justify-center">
          <Text className="text-sm text-gray-400">
            {"Already have an account? "}
          </Text>
          <Pressable
            onPress={() => navigation.navigate("SignIn")}
            disabled={isLoading}
          >
            <Text className="text-sm font-semibold text-fixo-500">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
