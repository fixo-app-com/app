import { ActivityIndicator, View } from "react-native";
import { colors } from "../../constants/colors";

export function FullScreenLoader() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <ActivityIndicator size="large" color={colors.fixo[400]} />
    </View>
  );
}
