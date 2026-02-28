import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  scroll?: boolean;
  bottomInset?: boolean;
  children: ReactNode;
}

export function ScreenWrapper({ scroll, bottomInset, children }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: insets.top + 8,
    paddingBottom: bottomInset ? insets.bottom + 80 : 0,
  };

  if (scroll) {
    return (
      <ScrollView
        className="flex-1 bg-gray-100 px-4"
        style={paddingStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 px-4" style={paddingStyle}>
      {children}
    </View>
  );
}
