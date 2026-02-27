import { Text, View } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { signOut } from "../../../services/auth";
import { Button, Card, ScreenWrapper } from "../../../design-system";

export default function SettingsScreen() {
  const { user } = useAuth();

  return (
    <ScreenWrapper>
      <Text className="mb-6 text-xl font-bold text-white">Settings</Text>

      {/* User info */}
      <Card>
        <Text className="text-sm text-gray-400">Email</Text>
        <Text className="mt-1 text-base text-white">
          {user?.email ?? "\u2014"}
        </Text>
      </Card>

      <View className="mt-6" />

      {/* Sign out */}
      <Button
        label="Sign out"
        variant="outline"
        onPress={() => signOut()}
      />
    </ScreenWrapper>
  );
}
