import { Pressable, Text, View } from "react-native";

interface ChipGroupProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  compact?: boolean;
}

export function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
  compact = false,
}: ChipGroupProps<T>) {
  const chipPadding = compact ? "px-3 py-2" : "p-3";
  const textSize = compact ? "text-sm" : "text-2xl";

  return (
    <View className="flex-row flex-wrap">
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`m-1 items-center justify-center rounded-xl ${chipPadding} ${
              isSelected ? "bg-fixo-950" : "bg-gray-900"
            }`}
          >
            <Text
              className={`${textSize} ${isSelected ? "text-fixo-400" : "text-gray-400"}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
