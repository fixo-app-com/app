import { View } from "react-native";
import { Button } from "../Button/Button";

type Props = {
  saveLabel: string;
  onSave: () => void;
  saving?: boolean;
  deleteLabel?: string;
  onDelete?: () => void;
};

export function SaveDeleteFooter({
  saveLabel,
  onSave,
  saving,
  deleteLabel,
  onDelete,
}: Props) {
  return (
    <View className="mt-6 pb-4">
      <Button label={saveLabel} onPress={onSave} loading={saving} />
      {deleteLabel && onDelete && (
        <View className="mt-3">
          <Button label={deleteLabel} variant="destructive" onPress={onDelete} />
        </View>
      )}
    </View>
  );
}
