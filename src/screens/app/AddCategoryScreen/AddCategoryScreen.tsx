import { useState } from "react";
import { Alert, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { CategoriesStackParamList } from "../../../navigation/RootNavigator";
import {
  Button,
  ChipGroup,
  Input,
  ScreenHeader,
  ScreenWrapper,
} from "../../../design-system";

type Nav = NativeStackNavigationProp<CategoriesStackParamList, "AddCategory">;

const EMOJI_OPTIONS = [
  // People & family
  "\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66",
  "\uD83D\uDC76",
  "\uD83D\uDC69",
  // Transport
  "\uD83D\uDE97",
  "\u26FD",
  "\uD83D\uDE8C",
  "\uD83D\uDEB2",
  // Home & living
  "\uD83C\uDFE0",
  "\uD83D\uDECB\uFE0F",
  "\uD83D\uDD27",
  "\uD83E\uDDF9",
  // Education & work
  "\uD83C\uDF93",
  "\uD83D\uDCBC",
  "\uD83D\uDCDA",
  // Health
  "\uD83C\uDFE5",
  "\uD83D\uDC8A",
  "\uD83E\uDDD1\u200D\u2695\uFE0F",
  // Food & drink
  "\uD83C\uDF54",
  "\uD83D\uDED2",
  "\u2615",
  "\uD83C\uDF7D\uFE0F",
  // Entertainment
  "\uD83C\uDFAE",
  "\uD83C\uDFAC",
  "\uD83C\uDFB5",
  "\uD83D\uDCFA",
  // Tech & communication
  "\uD83D\uDCF1",
  "\uD83D\uDCBB",
  "\uD83C\uDF10",
  // Travel
  "\u2708\uFE0F",
  "\uD83C\uDFD6\uFE0F",
  "\uD83C\uDFA2",
  // Pets
  "\uD83D\uDC3E",
  "\uD83D\uDC36",
  "\uD83D\uDC31",
  // Shopping & fashion
  "\uD83D\uDC57",
  "\uD83D\uDC5F",
  "\uD83D\uDECD\uFE0F",
  // Sports & fitness
  "\u26BD",
  "\uD83C\uDFCB\uFE0F",
  "\uD83C\uDFC3",
  // Finance & bills
  "\uD83D\uDCA1",
  "\uD83D\uDCB0",
  "\uD83C\uDFE6",
  "\uD83D\uDCC8",
  // Other
  "\uD83C\uDF81",
  "\u2764\uFE0F",
  "\uD83D\uDCE6",
  "\u2B50",
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
