import { useRef, useState } from "react";
import {
  InputAccessoryView,
  Keyboard,
  Pressable,
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

  const accessoryId = useRef(
    multiline ? `input-accessory-${++accessoryCounter}` : undefined,
  ).current;

  return (
    <View>
      {label ? (
        <Text className="mb-2 text-sm text-gray-500">{label}</Text>
      ) : null}
      <View className="flex-row items-center rounded-xl bg-white">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          multiline={multiline}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          secureTextEntry={isPassword && hidden}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={editable}
          maxLength={maxLength}
          returnKeyType={multiline ? undefined : "done"}
          onSubmitEditing={multiline ? undefined : () => Keyboard.dismiss()}
          inputAccessoryViewID={accessoryId}
          style={[
            {
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 16,
              fontSize: 16,
              color: "#111827",
            },
            style,
          ]}
        />
        {isPassword && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
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

      {/* Keyboard toolbar with Done button for multiline inputs */}
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
