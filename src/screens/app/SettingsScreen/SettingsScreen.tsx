import { Pressable, Text, View } from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { signOut } from "../../../services/auth";
import { CURRENCIES } from "../../../constants/banks";
import { Button, Card, ScreenWrapper } from "../../../design-system";

export default function SettingsScreen() {
  const { user } = useAuth();
  const { currency, setCurrency } = useData();

  return (
    <ScreenWrapper scroll>
      <Text className="mb-6 text-2xl font-bold text-white">Settings</Text>

      {/* User info */}
      <Card>
        <Text className="text-sm text-gray-400">Email</Text>
        <Text className="mt-1 text-base text-white">
          {user?.email ?? "\u2014"}
        </Text>
      </Card>

      <View className="mt-6" />

      {/* Currency */}
      <Text className="mb-2 text-sm text-gray-400">Currency</Text>
      <View className="flex-row flex-wrap">
        {CURRENCIES.map((c) => {
          const isSelected = c.code === currency;
          return (
            <Pressable
              key={c.code}
              onPress={() => setCurrency(c.code)}
              className={`m-1 rounded-xl px-4 py-2 ${
                isSelected
                  ? "border-2 border-fixo-400 bg-gray-800"
                  : "border border-gray-700 bg-gray-900"
              }`}
            >
              <Text
                className={`text-sm font-medium ${isSelected ? "text-fixo-400" : "text-gray-300"}`}
              >
                {c.symbol} {c.code}
              </Text>
            </Pressable>
          );
        })}
      </View>

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
