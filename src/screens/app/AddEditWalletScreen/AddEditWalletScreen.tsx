import { useState } from "react";
import { Alert, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { Button, Input, ScreenHeader, ScreenWrapper } from "../../../design-system";

type Nav = NativeStackNavigationProp<WalletsStackParamList, "AddEditWallet">;
type Route = RouteProp<WalletsStackParamList, "AddEditWallet">;

export default function AddEditWalletScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { walletId, walletName } = route.params;
  const { addWallet, updateWallet, deleteWallet } = useData();

  const isEditing = !!walletId;

  const [name, setName] = useState(walletName ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Error", "Please enter a wallet name.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && walletId) {
        await updateWallet(walletId, { name: trimmed });
      } else {
        await addWallet({ name: trimmed });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save wallet:", error);
      Alert.alert("Error", "Failed to save wallet.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!walletId) return;

    Alert.alert("Delete wallet", `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteWallet(walletId);
            navigation.goBack();
          } catch (error) {
            console.error("Failed to delete wallet:", error);
          }
        },
      },
    ]);
  }

  return (
    <ScreenWrapper scroll>
      <ScreenHeader
        title={isEditing ? "Edit wallet" : "New wallet"}
        onBack={() => navigation.goBack()}
      />

      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Chase, Revolut..."
        autoFocus
      />

      <View className="mb-6" />

      <Button
        label={saving ? "Saving..." : isEditing ? "Save changes" : "Save wallet"}
        onPress={handleSave}
        disabled={saving}
      />

      {isEditing && (
        <>
          <View className="mb-3" />
          <Button
            label="Delete wallet"
            variant="destructive"
            onPress={handleDelete}
          />
        </>
      )}
    </ScreenWrapper>
  );
}
