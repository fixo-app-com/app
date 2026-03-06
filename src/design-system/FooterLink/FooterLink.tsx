import { Pressable, Text, View } from "react-native";

type FooterLinkProps = {
  message: string;
  linkText: string;
  onPress: () => void;
  disabled?: boolean;
};

export function FooterLink({
  message,
  linkText,
  onPress,
  disabled,
}: FooterLinkProps) {
  return (
    <View className="flex-row justify-center">
      <Text className="text-sm text-gray-400">{message}</Text>
      <Pressable onPress={onPress} disabled={disabled}>
        <Text className="text-sm font-semibold text-fixo-500">{linkText}</Text>
      </Pressable>
    </View>
  );
}
