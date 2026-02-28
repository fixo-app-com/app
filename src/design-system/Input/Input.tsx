import { Text, TextInput, View, type KeyboardTypeOptions } from "react-native";

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
  autoComplete?: string;
  editable?: boolean;
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
  style,
}: InputProps) {
  return (
    <View>
      {label ? (
        <Text className="mb-2 text-sm text-gray-500">{label}</Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        multiline={multiline}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete as any}
        editable={editable}
        className="rounded-xl bg-white px-4 py-3.5 text-base text-gray-900"
        style={style}
      />
    </View>
  );
}
