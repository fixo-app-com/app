import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type SocialLoginButtonsProps = {
  onApplePress: () => void;
  onGooglePress: () => void;
  loadingAction: "email" | "apple" | "google" | null;
  isLoading: boolean;
};

export function SocialLoginButtons({
  onApplePress,
  onGooglePress,
  loadingAction,
  isLoading,
}: SocialLoginButtonsProps) {
  return (
    <>
      {/* Divider */}
      <View className="mb-4 flex-row items-center">
        <View className="h-px flex-1 bg-gray-300" />
        <Text className="mx-4 text-sm text-gray-400">or</Text>
        <View className="h-px flex-1 bg-gray-300" />
      </View>

      {/* Apple Sign-In button */}
      <View className="mb-3">
        <Pressable
          onPress={onApplePress}
          disabled={isLoading}
          className="flex-row items-center justify-center rounded-xl bg-black py-3.5"
          style={({ pressed }) => ({
            opacity: pressed || isLoading ? 0.7 : 1,
          })}
        >
          {loadingAction === "apple" ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="logo-apple" size={18} color="#FFFFFF" />
              <Text className="ml-2 text-base font-semibold text-white">
                Continue with Apple
              </Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Google Sign-In button */}
      <View className="mb-8">
        <Pressable
          onPress={onGooglePress}
          disabled={isLoading}
          className="flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-3.5"
          style={({ pressed }) => ({
            opacity: pressed || isLoading ? 0.7 : 1,
          })}
        >
          {loadingAction === "google" ? (
            <ActivityIndicator size="small" color="#4285F4" />
          ) : (
            <>
              <Ionicons name="logo-google" size={18} color="#4285F4" />
              <Text className="ml-2 text-base font-semibold text-gray-700">
                Continue with Google
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </>
  );
}
