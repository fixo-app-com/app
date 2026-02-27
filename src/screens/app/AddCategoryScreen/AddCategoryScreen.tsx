import { useState } from "react";
import { Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import {
  Button,
  ChipGroup,
  Input,
  ScreenHeader,
  ScreenWrapper,
} from "../../../design-system";

type Nav = NativeStackNavigationProp<HomeStackParamList, "AddCategory">;

const EMOJI_OPTIONS = [
  "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66",
  "\uD83D\uDE97",
  "\uD83C\uDFE0",
  "\uD83C\uDF93",
  "\uD83C\uDFE5",
  "\uD83C\uDF54",
  "\uD83C\uDFAE",
  "\uD83D\uDCF1",
  "\u2708\uFE0F",
  "\uD83D\uDC3E",
  "\uD83D\uDCBC",
  "\uD83C\uDFB5",
  "\uD83D\uDC57",
  "\u26BD",
  "\uD83D\uDCE6",
  "\uD83D\uDCA1",
];

export default function AddCategoryScreen() {
  const navigation = useNavigation<Nav>();
  const { addCategory } = useData();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("\uD83D\uDCE6");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Error", "Please enter a category name.");
      return;
    }

    setSaving(true);
    try {
      await addCategory({ name: trimmed, icon });
      navigation.goBack();
    } catch (error) {
      console.error("Failed to add category:", error);
      Alert.alert("Error", "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenWrapper scroll>
      <ScreenHeader
        title="New category"
        onBack={() => navigation.goBack()}
      />

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Family, Car, Home..."
        autoFocus
      />

      <View className="mb-6" />

      <ChipGroup
        options={EMOJI_OPTIONS.map((emoji) => ({ value: emoji, label: emoji }))}
        selected={icon}
        onSelect={setIcon}
      />

      <View className="mb-8" />

      <Button
        label={saving ? "Saving..." : "Save category"}
        onPress={handleSave}
        disabled={saving}
      />
    </ScreenWrapper>
  );
}
