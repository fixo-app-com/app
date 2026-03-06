import { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheet } from "../BottomSheet/BottomSheet";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  visible: boolean;
  title: string;
  options: Option<T>[];
  selected: T;
  onSelect: (option: T) => void;
  onClose: () => void;
};

export function SortBottomSheet<T extends string>({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: Props<T>) {
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleSelect = useCallback(
    (option: T) => {
      onSelect(option);
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      title={title}
      snapPoints={["30%"]}
      onDismiss={onClose}
    >
      <View className="pb-6">
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              className="flex-row items-center justify-between rounded-xl py-3"
              style={({ pressed }) => ({
                backgroundColor: pressed ? "#f3f4f6" : "transparent",
              })}
            >
              <Text
                className={`text-base ${isSelected ? "font-semibold text-fixo-400" : "text-gray-700"}`}
              >
                {option.label}
              </Text>
              {isSelected && (
                <Ionicons name="checkmark" size={20} color="#818cf8" />
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}
