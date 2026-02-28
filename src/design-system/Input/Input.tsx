import { useState } from "react";
import {
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
    </View>
  );
}
