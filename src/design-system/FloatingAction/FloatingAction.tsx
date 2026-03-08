import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface FloatingActionProps {
  onPress: () => void;
}

export function FloatingAction({ onPress }: FloatingActionProps) {
  return (
    <View className="absolute" style={{ bottom: 24, right: 20 }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Add"
        className="h-14 w-14 items-center justify-center rounded-full bg-fixo-400 shadow-lg"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}
