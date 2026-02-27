import { Pressable, Text, View } from "react-native";
import { signOut } from "../../../services/auth";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-950">
      <Text className="text-4xl font-extrabold text-fixo-400">FIXO</Text>
      <Pressable
        onPress={() => signOut()}
        className="mt-8 rounded-xl border border-gray-700 px-6 py-3"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="text-base text-gray-300">Sign Out</Text>
      </Pressable>
    </View>
  );
}
