import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  scroll?: boolean;
  bottomInset?: boolean;
  header?: ReactNode;
  children: ReactNode;
}

export function ScreenWrapper({
  scroll,
  bottomInset,
  header,
  children,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const bottomPadding = bottomInset ? insets.bottom + 80 : 0;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Fixed header area — never scrolls */}
      <View style={{ paddingTop: insets.top + 8 }} className="bg-gray-100 px-4">
        {header}
      </View>

      {scroll ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={insets.top}
        >
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomPadding }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View
          className="flex-1 px-4"
          style={{ paddingBottom: bottomPadding }}
        >
          {children}
        </View>
      )}
    </View>
  );
}
