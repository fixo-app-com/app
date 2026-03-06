import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import { getExpenses } from "../../../services/firestore";
import type { HomeStackParamList } from "../../../navigation/RootNavigator";
import type { BillingFrequency, Expense } from "../../../types/firestore";
import { getCurrencySymbol } from "../../../constants/banks";
import {
  Button,
  ChipGroup,
  FormRow,
  FullScreenLoader,
  Input,
  ScreenHeader,
  ScreenWrapper,
  SectionHeader,
} from "../../../design-system";

type Nav = NativeStackNavigationProp<HomeStackParamList, "AddEditExpense">;
type Route = RouteProp<HomeStackParamList, "AddEditExpense">;

export default function AddEditExpenseScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, expenseId } = route.params;
  const { user } = useAuth();
  const { wallets, currency } = useData();

  const isEditing = !!expenseId;

  const [name, setName] = useState("");
  const [amountText, setAmountText] = useState("");
  const [billingFrequency, setBillingFrequency] =
    useState<BillingFrequency>("monthly");
  const [walletId, setWalletId] = useState(
    wallets.length > 0 ? wallets[0].id : "",
  );
  const [essential, setEssential] = useState(!isEditing);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(isEditing);

  const { addExpense, updateExpense, deleteExpense } = useData();

  // Auto-select first wallet when wallets become available (e.g. after creating one)
  useEffect(() => {
    if (!walletId && wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  useEffect(() => {
    if (!isEditing || !user) return;

    async function loadExpense() {
      try {
        const allExpenses = await getExpenses(user!.uid, { categoryId });
        const expense = allExpenses.find((e: Expense) => e.id === expenseId);
        if (expense) {
          setName(expense.name);
          setAmountText((expense.amountCents / 100).toFixed(2));
          setBillingFrequency(expense.billingFrequency ?? "monthly");
          setWalletId(expense.walletId);
          setEssential(expense.essential);
          setNotes(expense.notes);
        }
      } catch (error) {
        if (__DEV__) console.error("Failed to load expense:", error);
      } finally {
        setLoadingExpense(false);
      }
    }

    loadExpense();
  }, [isEditing, user, categoryId, expenseId]);

  function parseAmount(text: string): number | null {
    const cleaned = text.replace(",", ".");
    const num = parseFloat(cleaned);
    if (isNaN(num) || num < 0 || num > 99_999_999) return null;
    return Math.round(num * 100);
  }

  async function handleSave() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert(t("common.error"), t("addEditExpense.enterName"));
      return;
    }

    const amountCents = parseAmount(amountText);
    if (amountCents === null || amountCents <= 0) {
      Alert.alert(t("common.error"), t("addEditExpense.invalidAmount"));
      return;
    }

    if (!walletId) {
      Alert.alert(
        t("addEditExpense.walletRequiredTitle"),
        t("addEditExpense.walletRequiredMessage"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("addEditExpense.createWallet"),
            onPress: () =>
              navigation.navigate("AddEditWallet", {}),
          },
        ],
      );
      return;
    }

    if (!user) return;

    setSaving(true);
    try {
      const data = {
        categoryId,
        name: trimmedName,
        amountCents,
        billingFrequency,
        walletId,
        essential,
        notes: notes.trim(),
      };

      if (isEditing && expenseId) {
        await updateExpense(expenseId, data);
      } else {
        await addExpense(data);
      }
      navigation.goBack();
    } catch (error) {
      if (__DEV__) console.error("Failed to save expense:", error);
      Alert.alert(t("common.error"), t("addEditExpense.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || !expenseId) return;

    Alert.alert(t("addEditExpense.deleteTitle"), t("addEditExpense.deleteMessage", { name }), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteExpense(expenseId);
            navigation.goBack();
          } catch (error) {
            if (__DEV__) console.error("Failed to delete expense:", error);
          }
        },
      },
    ]);
  }

  if (loadingExpense) {
    return <FullScreenLoader />;
  }

  const currencySymbol = getCurrencySymbol(currency);

  const headerContent = (
    <ScreenHeader
      title={isEditing ? t("addEditExpense.editTitle") : t("addEditExpense.newTitle")}
      onBack={() => navigation.goBack()}
    />
  );

  return (
    <ScreenWrapper scroll header={headerContent}>
      <View className="gap-4">
        <Input
          label={t("addEditExpense.nameLabel")}
          value={name}
          onChangeText={setName}
          placeholder={t("addEditExpense.namePlaceholder")}
          maxLength={100}
        />

        <Input
          label={t("addEditExpense.amountLabel", { symbol: currencySymbol })}
          value={amountText}
          onChangeText={setAmountText}
          placeholder={t("addEditExpense.amountPlaceholder")}
          keyboardType="decimal-pad"
        />

        <ChipGroup
          options={[
            { value: "monthly" as BillingFrequency, label: t("common.monthly") },
            { value: "yearly" as BillingFrequency, label: t("common.yearly") },
          ]}
          selected={billingFrequency}
          onSelect={setBillingFrequency}
          compact
        />
      </View>

      <SectionHeader title={t("addEditExpense.walletSection")} />

      {wallets.length === 0 ? (
        <Button
          label={t("addEditExpense.createWallet")}
          variant="outline"
          onPress={() => navigation.navigate("AddEditWallet", {})}
        />
      ) : (
        <ChipGroup
          options={wallets.map((w) => ({ value: w.id, label: w.name }))}
          selected={walletId}
          onSelect={setWalletId}
          compact
        />
      )}

      <SectionHeader title={t("addEditExpense.optionsSection")} />

      <FormRow
        label={t("addEditExpense.essentialLabel")}
        first
        last
        right={
          <Switch
            value={essential}
            onValueChange={setEssential}
            trackColor={{ false: "#d1d5db", true: "#818cf8" }}
            thumbColor="#fff"
          />
        }
      />
      <Text className="mt-2 text-xs text-gray-400">
        {t("addEditExpense.essentialHint")}
      </Text>

      <SectionHeader title={t("addEditExpense.notesSection")} />

      <Input
        value={notes}
        onChangeText={setNotes}
        placeholder=""
        multiline
        maxLength={500}
        style={{ minHeight: 80 }}
      />

      <View className="flex-1" />

      <View className="mt-6 pb-4">
        <Button
          label={isEditing ? t("addEditExpense.saveChanges") : t("addEditExpense.saveExpense")}
          onPress={handleSave}
          loading={saving}
        />

        {isEditing && (
          <View className="mt-3">
            <Button
              label={t("addEditExpense.deleteExpense")}
              variant="destructive"
              onPress={handleDelete}
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
