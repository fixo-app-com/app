import { useState } from "react";
import { Alert, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import {
  Button,
  ChipGroup,
  Input,
  ScreenHeader,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";

type Nav = NativeStackNavigationProp<HomeStackParamList, "AddEditCategory">;
type Route = RouteProp<HomeStackParamList, "AddEditCategory">;

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

export default function AddEditCategoryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, categoryName, categoryIcon } = route.params ?? {};
  const { addCategory, updateCategory } = useData();

  const isEditing = !!categoryId;

  const [name, setName] = useState(categoryName ?? "");
  const [icon, setIcon] = useState(categoryIcon ?? "📦");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Error", "Please enter a category name.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && categoryId) {
        await updateCategory(categoryId, { name: trimmed, icon });
      } else {
        await addCategory({ name: trimmed, icon });
      }
      navigation.goBack();
    } catch (error) {
      if (__DEV__) console.error("Failed to save category:", error);
      Alert.alert("Error", "Failed to save category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenWrapper scroll>
      <ScreenHeader
        title={isEditing ? "Edit category" : "New category"}
        onBack={() => navigation.goBack()}
      />

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Family, Car, Home..."
        autoFocus={!isEditing}
        maxLength={50}
      />

      <SectionHeader title="Icon" />

      <ChipGroup
        options={EMOJI_OPTIONS.map((emoji) => ({ value: emoji, label: emoji }))}
        selected={icon}
        onSelect={setIcon}
      />

      <View className="mb-8" />

      <Button
        label={isEditing ? "Save changes" : "Save category"}
        onPress={handleSave}
        loading={saving}
      />
    </ScreenWrapper>
  );
}
