import { Pressable, Text, View, useWindowDimensions } from "react-native";

interface ChipGroupProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
  compact?: boolean;
}

const HORIZONTAL_PADDING = 32; // px-4 on each side
const GAP = 8;

export function ChipGroup<T extends string>({
  options,
  selected,
  onSelect,
  compact = false,
}: ChipGroupProps<T>) {
  const { width: screenWidth } = useWindowDimensions();
  const chipPadding = compact ? "px-3 py-2" : "p-3";
  const textSize = compact ? "text-sm" : "text-2xl";

  // For non-compact (emoji) mode, compute responsive item size
  const itemBaseWidth = compact ? 0 : 60; // target ~60px per emoji chip
  const containerWidth = screenWidth - HORIZONTAL_PADDING;

  let itemSize: number | undefined;
  if (!compact) {
    const columns = Math.floor(
      (containerWidth + GAP) / (itemBaseWidth + GAP),
    );
    itemSize = (containerWidth - (columns - 1) * GAP) / columns;
  }

  return (
    <View
      className={`flex-row flex-wrap${compact ? " mb-2" : ""}`}
      style={compact ? undefined : { gap: GAP }}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            className={`items-center justify-center rounded-xl ${chipPadding} ${
              isSelected ? "bg-fixo-100" : "bg-white"
            }${compact ? " m-1" : ""}`}
            style={
              compact
                ? undefined
                : { width: itemSize, height: itemSize }
            }
          >
            <Text
              className={`${textSize} ${isSelected ? "text-fixo-600" : "text-gray-500"}`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
