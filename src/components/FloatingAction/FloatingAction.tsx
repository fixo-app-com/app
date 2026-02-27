import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "../../design-system";

interface FloatingActionProps {
  label: string;
  onPress: () => void;
}

export function FloatingAction({ label, onPress }: FloatingActionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute left-4 right-4"
      style={{ bottom: insets.bottom + 8 }}
    >
      <Button label={label} onPress={onPress} />
    </View>
  );
}
