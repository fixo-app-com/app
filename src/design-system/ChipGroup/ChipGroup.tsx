import { Pressable, Text, View } from "react-native";

interface ChipGroupProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}

export function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
}: ChipGroupProps<T>) {
  return (
    <View className="flex-row flex-wrap">
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`m-1 items-center justify-center rounded-xl p-3 ${
              isSelected
                ? "border-2 border-fixo-400 bg-gray-800"
                : "border border-gray-700 bg-gray-900"
            }`}
          >
            <Text
              className={`text-2xl ${isSelected ? "text-fixo-400" : "text-gray-300"}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
