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
  SectionHeader,
} from "../../../design-system";

type Nav = NativeStackNavigationProp<CategoriesStackParamList, "AddCategory">;

const EMOJI_OPTIONS = [
  // People & family
  "👨‍👩‍👧‍👦",
  "👶",
  "👩",
  // Transport
  "🚗",
  "⛽",
  "🚌",
  "🚲",
  // Home & living
  "🏠",
  "🛋️",
  "🔧",
  "🧹",
  // Education & work
  "🎓",
  "💼",
  "📚",
  // Health
  "🏥",
  "💊",
  "🧑‍⚕️",
  // Food & drink
  "🍔",
  "🛒",
  "☕",
  "🍽️",
  // Entertainment
  "🎮",
  "🎬",
  "🎵",
  "📺",
  // Tech & communication
  "📱",
  "💻",
  "🌐",
  // Travel
  "✈️",
  "🏖️",
  "🚢",
  // Pets
  "🐾",
  "🐶",
  "🐱",
  // Shopping & fashion
  "👕",
  "👟",
  "🛍️",
  // Sports & fitness
  "⚽",
  "🏋️",
  "🏃",
  // Finance & bills
  "💡",
  "💰",
  "🏦",
  "📈",
  // Other
  "🎁",
  "❤️",
  "📦",
  "⭐",
];

export default function AddCategoryScreen() {
  const navigation = useNavigation<Nav>();
  const { addCategory } = useData();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📦");
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

      <SectionHeader title="Icon" />

      <ChipGroup
        options={EMOJI_OPTIONS.map((emoji) => ({ value: emoji, label: emoji }))}
        selected={icon}
        onSelect={setIcon}
      />

      <View className="mb-8" />

      <Button
        label="Save category"
        onPress={handleSave}
        loading={saving}
      />
    </ScreenWrapper>
  );
}
