import { Text, View } from "react-native";
import { getBankByKey } from "../../constants/banks";

interface BankIconProps {
  bankKey: string;
  size?: number;
}

export function BankIcon({ bankKey, size = 36 }: BankIconProps) {
  const bank = getBankByKey(bankKey);

  const bgColor = bank?.color ?? "#4B5563";
  const abbr = bank?.abbr ?? "?";
  const fontSize = size * 0.38;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{ fontSize, fontWeight: "700", color: "#fff" }}
        numberOfLines={1}
      >
        {abbr}
      </Text>
    </View>
  );
}
