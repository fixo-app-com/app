import { View } from "react-native";

export function DotIndicators({ count, active }: { count: number; active: number }) {
  return (
    <View
      className="mt-2 flex-row items-center justify-center gap-2"
      testID="dot-indicators"
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          className={`h-2 w-2 rounded-full ${i === active ? "bg-gray-800" : "bg-gray-300"}`}
        />
      ))}
    </View>
  );
}
