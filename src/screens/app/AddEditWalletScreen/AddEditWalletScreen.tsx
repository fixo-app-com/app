import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { BANKS } from "../../../constants/banks";
import { BankIcon } from "../../../components";
import { Button, Input, ScreenHeader, ScreenWrapper } from "../../../design-system";

type Nav = NativeStackNavigationProp<WalletsStackParamList, "AddEditWallet">;
type Route = RouteProp<WalletsStackParamList, "AddEditWallet">;

export default function AddEditWalletScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { walletId, walletName, walletIcon } = route.params;
  const { addWallet, updateWallet, deleteWallet } = useData();

  const isEditing = !!walletId;

  const [name, setName] = useState(walletName ?? "");
  const [icon, setIcon] = useState(walletIcon ?? "");
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
        await updateWallet(walletId, { name: trimmed, icon });
      } else {
        await addWallet({ name: trimmed, icon });
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
        placeholder="e.g. Revolut, N26..."
        autoFocus
      />

      <View className="mb-6" />

      {/* Bank icon picker */}
      <Text className="mb-2 text-sm text-gray-400">Bank icon</Text>
      <ScrollView
        horizontal={false}
        contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
      >
        {/* Generic / no icon option */}
        <Pressable
          onPress={() => setIcon("")}
          className={`m-1 items-center justify-center rounded-xl p-2 ${
            icon === ""
              ? "border-2 border-fixo-400 bg-gray-800"
              : "border border-gray-700 bg-gray-900"
          }`}
          style={{ width: 64, height: 64 }}
        >
          <BankIcon bankKey="" size={32} />
          <Text className="mt-1 text-[9px] text-gray-400" numberOfLines={1}>
            Generic
          </Text>
        </Pressable>

        {BANKS.map((bank) => {
          const isSelected = icon === bank.key;
          return (
            <Pressable
              key={bank.key}
              onPress={() => setIcon(bank.key)}
              className={`m-1 items-center justify-center rounded-xl p-2 ${
                isSelected
                  ? "border-2 border-fixo-400 bg-gray-800"
                  : "border border-gray-700 bg-gray-900"
              }`}
              style={{ width: 64, height: 64 }}
            >
              <BankIcon bankKey={bank.key} size={32} />
              <Text
                className="mt-1 text-[9px] text-gray-400"
                numberOfLines={1}
              >
                {bank.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mb-6" />

      <Button
        label={
          saving ? "Saving..." : isEditing ? "Save changes" : "Save wallet"
        }
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
