import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

interface ScreenWrapperProps {
  scroll?: boolean;
  children: ReactNode;
}

export function ScreenWrapper({ scroll, children }: ScreenWrapperProps) {
  if (scroll) {
    return (
      <ScrollView
        className="flex-1 bg-gray-950 px-4 pt-16"
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return <View className="flex-1 bg-gray-950 px-4 pt-16">{children}</View>;
}
