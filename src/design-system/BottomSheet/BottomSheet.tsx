import { forwardRef, useCallback, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

type Props = {
  title?: string;
  snapPoints?: string[];
  onDismiss?: () => void;
  children: React.ReactNode;
};

export const BottomSheet = forwardRef<BottomSheetModal, Props>(
  function BottomSheet(
    { title, snapPoints: snapPointsProp, onDismiss, children },
    ref,
  ) {
    const snapPoints = useMemo(
      () => snapPointsProp ?? ["40%"],
      [snapPointsProp],
    );

    const animationConfigs = useMemo(
      () => ({ duration: 350, easing: Easing.out(Easing.cubic) }),
      [],
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

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enablePanDownToClose
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        animationConfigs={animationConfigs}
        backgroundStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 40 }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        >
          <View
            className={`mb-3 flex-row items-center ${title ? "justify-between" : "justify-end"}`}
          >
            {title && (
              <Text className="text-lg font-semibold text-gray-900">
                {title}
              </Text>
            )}

            <Pressable
              onPress={() => {
                if (ref && "current" in ref) ref.current?.dismiss();
              }}
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
          {children}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);
