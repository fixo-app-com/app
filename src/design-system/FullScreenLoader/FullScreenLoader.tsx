import { ActivityIndicator, View } from "react-native";

export function FullScreenLoader() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-950">
      <ActivityIndicator size="large" color="#818cf8" />
    </View>
  );
}
