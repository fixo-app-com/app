import { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SORT_OPTIONS, type SortOption } from "../../constants/sort";
import { BottomSheet } from "../BottomSheet/BottomSheet";

type Props = {
  visible: boolean;
  selected: SortOption;
  onSelect: (option: SortOption) => void;
  onClose: () => void;
};

export function SortBottomSheet({
  visible,
  selected,
  onSelect,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const handleSelect = useCallback(
    (option: SortOption) => {
      onSelect(option);
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      title={t("sort.sortBy")}
      snapPoints={["30%"]}
      onDismiss={onClose}
    >
      <View className="pb-6">
        {SORT_OPTIONS.map((option) => {
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
                {t(option.labelKey)}
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
