import { useState } from "react";
import { Alert, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import type { AppRootStackParamList } from "../../../navigation/RootNavigator";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import {
  ChipGroup,
  FormLabel,
  Input,
  SaveDeleteFooter,
  ScreenHeader,
  ScreenWrapper,
} from "../../../design-system";

type Nav = NativeStackNavigationProp<AppRootStackParamList, "AddEditCategory">;
type Route = RouteProp<AppRootStackParamList, "AddEditCategory">;

const EMOJI_OPTIONS = [
  // People & family
  "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}",
  // Transport
  "\u{1F697}",
  "\u26FD",
  // Home & living
  "\u{1F3E0}",
  "\u{1F6CB}\uFE0F",
  "\u{1F527}",
  // Education & work
  "\u{1F393}",
  "\u{1F4BC}",
  "\u{1F4DA}",
  // Health
  "\u{1F3E5}",
  "\u{1F48A}",
  // Food & drink
  "\u{1F354}",
  "\u{1F6D2}",
  "\u2615",
  "\u{1F37D}\uFE0F",
  // Entertainment
  "\u{1F3AE}",
  "\u{1F3AC}",
  "\u{1F4FA}",
  // Tech & communication
  "\u{1F4F1}",
  "\u{1F4BB}",
  // Travel
  "\u2708\uFE0F",
  "\u{1F3D6}\uFE0F",
  // Pets
  "\u{1F43E}",
  // Shopping & fashion
  "\u{1F6CD}\uFE0F",
  // Sports & fitness
  "\u26BD",
  "\u{1F3CB}\uFE0F",
  // Finance & bills
  "\u{1F4A1}",
  "\u{1F4B0}",
  "\u{1F3E6}",
  // Other
  "\u{1F381}",
];

export default function AddEditCategoryScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, categoryName, categoryIcon } = route.params ?? {};
  const { user } = useAuth();
  const {
    addCategory,
    updateCategory,
    deleteCategory,
    deleteExpensesByCategory,
  } = useData();
  const { confirmDelete } = useDeleteConfirmation();

  const isEditing = !!categoryId;

  const [name, setName] = useState(categoryName ?? "");
  const [icon, setIcon] = useState(categoryIcon ?? "\u{1F4E6}");
  const [saving, setSaving] = useState(false);

  function handleDelete() {
    if (!categoryId || !user) return;

    confirmDelete({
      title: t("addEditCategory.deleteTitle"),
      message: t("addEditCategory.deleteMessage", { name }),
      onConfirm: async () => {
        try {
          await deleteExpensesByCategory(categoryId);
          await deleteCategory(categoryId);
          navigation.navigate("MainTabs", {
            screen: "CategoriesTab",
            params: { screen: "Categories" },
          });
        } catch (error) {
          if (__DEV__) console.error("Failed to delete category:", error);
        }
      },
    });
  }

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert(t("common.error"), t("addEditCategory.enterName"));
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
      Alert.alert(t("common.error"), t("addEditCategory.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  const headerContent = (
    <ScreenHeader
      title={
        isEditing
          ? t("addEditCategory.editTitle")
          : t("addEditCategory.newTitle")
      }
      onBack={() => navigation.goBack()}
    />
  );

  return (
    <ScreenWrapper scroll header={headerContent}>
      <View className="mb-4">
        <FormLabel title={t("addEditCategory.nameLabel")} />
        <Input
          value={name}
          onChangeText={setName}
          placeholder={t("addEditCategory.namePlaceholder")}
          maxLength={50}
        />
      </View>

      <View className="mb-4">
        <FormLabel title={t("addEditCategory.iconSection")} />
        <ChipGroup
          options={EMOJI_OPTIONS.map((emoji) => ({
            value: emoji,
            label: emoji,
          }))}
          selected={icon}
          onSelect={setIcon}
        />
      </View>

      <View className="flex-1" />

      <SaveDeleteFooter
        saveLabel={
          isEditing
            ? t("addEditCategory.saveChanges")
            : t("addEditCategory.saveCategory")
        }
        onSave={handleSave}
        saving={saving}
        deleteLabel={
          isEditing ? t("addEditCategory.deleteCategory") : undefined
        }
        onDelete={isEditing ? handleDelete : undefined}
      />
      <View className="h-8" />
    </ScreenWrapper>
  );
}
