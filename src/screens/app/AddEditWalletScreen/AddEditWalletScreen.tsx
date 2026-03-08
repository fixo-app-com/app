import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useData } from "../../../contexts/DataContext";
import type { WalletsStackParamList } from "../../../navigation/RootNavigator";
import { BANKS } from "../../../constants/banks";
import { useDeleteConfirmation } from "../../../hooks/useDeleteConfirmation";
import { BankIcon } from "../../../components";
import {
  Input,
  SaveDeleteFooter,
  ScreenHeader,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";
import { useExpenses } from "../../../hooks/useExpenses";

type Nav = NativeStackNavigationProp<WalletsStackParamList, "AddEditWallet">;
type Route = RouteProp<WalletsStackParamList, "AddEditWallet">;

const ITEM_BASE_WIDTH = 72;
const H_PADDING = 32;
const ITEM_GAP = 8;

export default function AddEditWalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { walletId, walletName, walletIcon } = route.params;
  const { addWallet, updateWallet, deleteWallet } = useData();
  const { confirmDelete } = useDeleteConfirmation();
  const { width: screenWidth } = useWindowDimensions();

  const isEditing = !!walletId;
  const { expenses } = useExpenses(isEditing ? { walletId } : undefined);
  const hasExpenses = expenses.length > 0;

  const [name, setName] = useState(walletName ?? "");
  const [icon, setIcon] = useState(walletIcon ?? "");
  const [saving, setSaving] = useState(false);
  // Track whether user manually edited the name after selecting a bank
  const [bankSelected, setBankSelected] = useState(!!walletName);

  // Responsive grid
  const containerWidth = screenWidth - H_PADDING;
  const columns = Math.floor(
    (containerWidth + ITEM_GAP) / (ITEM_BASE_WIDTH + ITEM_GAP),
  );
  const itemWidth = (containerWidth - (columns - 1) * ITEM_GAP) / columns;

  // Filter banks based on name input
  const query = name.toLowerCase().trim();
  const filteredBanks =
    query && !bankSelected
      ? BANKS.filter((b) => b.name.toLowerCase().includes(query))
      : BANKS;

  function handleNameChange(text: string) {
    setName(text);
    if (bankSelected) {
      setBankSelected(false);
      setIcon("");
    }
    // Auto-select if input exactly matches a bank name
    const q = text.toLowerCase().trim();
    if (q) {
      const exactMatch = BANKS.find((b) => b.name.toLowerCase() === q);
      if (exactMatch) {
        setIcon(exactMatch.key);
        setBankSelected(true);
      }
    }
  }

  function handleBankSelect(bankKey: string, bankName: string) {
    setName(bankName);
    setIcon(bankKey);
    setBankSelected(true);
  }

  function handleGenericSelect() {
    setIcon("");
  }

  async function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert(t("common.error"), t("addEditWallet.enterName"));
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
      if (__DEV__) console.error("Failed to save wallet:", error);
      Alert.alert(t("common.error"), t("addEditWallet.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!walletId) return;

    confirmDelete({
      title: t("addEditWallet.deleteTitle"),
      message: t("addEditWallet.deleteMessage", { name }),
      onConfirm: async () => {
        try {
          await deleteWallet(walletId);
          navigation.popTo("Wallets");
        } catch (error) {
          if (__DEV__) console.error("Failed to delete wallet:", error);
        }
      },
    });
  }

  const headerContent = (
    <ScreenHeader
      title={
        isEditing ? t("addEditWallet.editTitle") : t("addEditWallet.newTitle")
      }
      onBack={() => navigation.goBack()}
    />
  );

  return (
    <ScreenWrapper scroll header={headerContent}>
      <Input
        label={t("addEditWallet.nameLabel")}
        value={name}
        onChangeText={handleNameChange}
        placeholder={t("addEditWallet.namePlaceholder")}
        maxLength={50}
      />

      <SectionHeader title={t("addEditWallet.bankIconSection")} />

      <View className="flex-row flex-wrap" style={{ gap: ITEM_GAP }}>
        {/* Generic / no icon option */}
        <Pressable
          onPress={handleGenericSelect}
          className={`items-center justify-center rounded-xl p-2 ${
            icon === "" ? "bg-fixo-100" : "bg-white"
          }`}
          style={{ width: itemWidth, height: itemWidth }}
        >
          <BankIcon bankKey="" size={32} />
          <Text className="mt-1 text-[9px] text-gray-400" numberOfLines={1}>
            {t("addEditWallet.other")}
          </Text>
        </Pressable>

        {filteredBanks.map((bank) => {
          const isSelected = icon === bank.key;
          return (
            <Pressable
              key={bank.key}
              onPress={() => handleBankSelect(bank.key, bank.name)}
              className={`items-center justify-center rounded-xl p-2 ${
                isSelected ? "bg-fixo-100" : "bg-white"
              }`}
              style={{
                width: itemWidth,
                height: itemWidth,
              }}
            >
              <BankIcon bankKey={bank.key} size={32} />
              <Text className="mt-1 text-[9px] text-gray-400" numberOfLines={1}>
                {bank.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-1" />

      <SaveDeleteFooter
        saveLabel={
          isEditing
            ? t("addEditWallet.saveChanges")
            : t("addEditWallet.saveWallet")
        }
        onSave={handleSave}
        saving={saving}
        deleteLabel={
          isEditing && !hasExpenses
            ? t("addEditWallet.deleteWallet")
            : undefined
        }
        onDelete={isEditing && !hasExpenses ? handleDelete : undefined}
      />
    </ScreenWrapper>
  );
}
