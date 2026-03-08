import { Text } from "react-native";

interface FormLabelProps {
  title: string;
}

export function FormLabel({ title }: FormLabelProps) {
  return <Text className="mb-2 text-sm text-gray-500">{title}</Text>;
}
