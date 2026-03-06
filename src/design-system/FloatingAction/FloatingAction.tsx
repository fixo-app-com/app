import { View } from "react-native";
import { Button } from "../Button/Button";

interface FloatingActionProps {
  label: string;
  onPress: () => void;
}

export function FloatingAction({ label, onPress }: FloatingActionProps) {
  return (
    <View className="absolute left-4 right-4" style={{ bottom: 16 }}>
      <Button label={label} onPress={onPress} />
    </View>
  );
}
