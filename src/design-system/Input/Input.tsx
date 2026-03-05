import { useRef, useState } from "react";
import {
  InputAccessoryView,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: TextInputProps["autoComplete"];
  editable?: boolean;
  maxLength?: number;
  style?: object;
}

let accessoryCounter = 0;

const NUMERIC_KEYBOARDS: KeyboardTypeOptions[] = [
  "decimal-pad",
  "number-pad",
  "phone-pad",
];

const baseInputStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
  fontSize: 16,
  color: "#111827",
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  autoFocus,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  autoComplete,
  editable,
  maxLength,
  style,
}: InputProps) {
  const [hidden, setHidden] = useState(true);
  const isPassword = secureTextEntry === true;

  const secureRef = useRef<TextInput>(null);
  const plainRef = useRef<TextInput>(null);

  const isNumericKeyboard =
    keyboardType != null && NUMERIC_KEYBOARDS.includes(keyboardType);
  const needsAccessory = multiline || isNumericKeyboard;

  const accessoryId = useRef(
    needsAccessory ? `input-accessory-${++accessoryCounter}` : undefined,
  ).current;

  function handleTogglePassword() {
    // Focus the OTHER input before toggling state.
    // Both inputs are always mounted (the inactive one is invisible but
    // still focusable), so iOS transfers keyboard focus between two
    // TextInputs whose secureTextEntry never changes — no glitch.
    const targetRef = hidden ? plainRef : secureRef;
    targetRef.current?.focus();
    setHidden((h) => !h);
  }

  return (
    <View>
      {label ? (
        <Text className="mb-2 text-sm text-gray-500">{label}</Text>
      ) : null}
      <View className="flex-row items-center rounded-xl bg-white">
        {isPassword ? (
          <View style={styles.passwordContainer}>
            {/* Secure input — secureTextEntry is always true */}
            <TextInput
              ref={secureRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#94a3b8"
              secureTextEntry={true}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="none"
              autoComplete="off"
              editable={editable}
              maxLength={maxLength}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              pointerEvents={hidden ? "auto" : "none"}
              style={[
                baseInputStyle,
                style,
                hidden ? styles.visibleInput : styles.hiddenInput,
              ]}
            />
            {/* Plain input — secureTextEntry is always false */}
            <TextInput
              ref={plainRef}
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="#94a3b8"
              secureTextEntry={false}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              textContentType="none"
              autoComplete="off"
              editable={editable}
              maxLength={maxLength}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              pointerEvents={!hidden ? "auto" : "none"}
              style={[
                baseInputStyle,
                style,
                !hidden ? styles.visibleInput : styles.hiddenInput,
              ]}
            />
          </View>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            multiline={multiline}
            autoFocus={autoFocus}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
            editable={editable}
            maxLength={maxLength}
            returnKeyType={needsAccessory ? undefined : "done"}
            onSubmitEditing={
              needsAccessory ? undefined : () => Keyboard.dismiss()
            }
            inputAccessoryViewID={accessoryId}
            style={[{ flex: 1, ...baseInputStyle }, style]}
          />
        )}
        {isPassword && (
          <Pressable
            onPress={handleTogglePassword}
            className="pr-4"
            hitSlop={8}
            testID="toggle-password"
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9ca3af"
            />
          </Pressable>
        )}
      </View>

      {/* Keyboard toolbar with Done button */}
      {accessoryId && (
        <InputAccessoryView nativeID={accessoryId}>
          <View className="flex-row justify-end border-t border-gray-200 bg-gray-100 px-4 py-2">
            <Pressable onPress={() => Keyboard.dismiss()} hitSlop={8}>
              <Text className="text-base font-semibold text-fixo-400">
                Done
              </Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  passwordContainer: {
    flex: 1,
    position: "relative",
  },
  visibleInput: {
    // Normal flow — takes space in the layout
  },
  hiddenInput: {
    // Overlaid behind the visible input — invisible but still focusable
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
  },
});
