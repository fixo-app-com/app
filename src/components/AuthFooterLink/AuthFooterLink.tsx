import { Pressable, Text, View } from "react-native";

type AuthFooterLinkProps = {
  message: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
};

export function AuthFooterLink({
  message,
  linkText,
  onPress,
  disabled,
}: AuthFooterLinkProps) {
  return (
    <View className="flex-row justify-center">
      <Text className="text-sm text-gray-400">{message}</Text>
      <Pressable onPress={onPress} disabled={disabled}>
        <Text className="text-sm font-semibold text-fixo-500">{linkText}</Text>
      </Pressable>
    </View>
  );
}
