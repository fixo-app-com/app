import { useCallback, useMemo, useRef, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SORT_OPTIONS, type SortOption } from "../../constants/sort";

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

  const renderBackdrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

  const snapPoints = useMemo(() => ["30%"], []);

  const animationConfigs = useMemo(
    () => ({ duration: 350, easing: Easing.out(Easing.cubic) }),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      animationConfigs={animationConfigs}
      backgroundStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 40 }}
    >
      <BottomSheetView className="flex-1 px-5 pb-6">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">Sort by</Text>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            className="items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              width: 32,
              height: 32,
            })}
          >
            <Ionicons name="close" size={22} color="#6b7280" />
          </Pressable>
        </View>

        {/* Options */}
        {SORT_OPTIONS.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.value}
              onPress={() => handleSelect(option.value)}
              className="flex-row items-center justify-between rounded-xl py-3 px-2"
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
      </BottomSheetView>
    </BottomSheetModal>
  );
}
