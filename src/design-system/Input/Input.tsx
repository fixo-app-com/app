import { Text, TextInput, type KeyboardTypeOptions } from "react-native";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
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
  style,
}: InputProps) {
  return (
    <>
      {label ? (
        <Text className="mb-2 text-sm text-gray-400">{label}</Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        multiline={multiline}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-base text-white"
        style={style}
      />
    </>
  );
}
