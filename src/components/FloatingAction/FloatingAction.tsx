import { View } from "react-native";
import { Button } from "../../design-system";

interface FloatingActionProps {
  label: string;
  onPress: () => void;
}

export function FloatingAction({ label, onPress }: FloatingActionProps) {
  return (
    <View className="absolute bottom-6 left-4 right-4">
      <Button label={label} onPress={onPress} />
    </View>
  );
}
