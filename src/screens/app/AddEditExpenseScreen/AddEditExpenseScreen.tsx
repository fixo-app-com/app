import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
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
  const [walletId, setWalletId] = useState("");
  const [essential, setEssential] = useState(!isEditing);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(isEditing);

  const { addExpense, updateExpense, deleteExpense } = useData();

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
      Alert.alert("Error", "Please enter an expense name.");
      return;
    }

    const amountCents = parseAmount(amountText);
    if (amountCents === null || amountCents <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
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
      Alert.alert("Error", "Failed to save expense.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || !expenseId) return;

    Alert.alert("Delete expense", `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
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
      title={isEditing ? "Edit expense" : "New expense"}
      onBack={() => navigation.goBack()}
    />
  );

  return (
    <ScreenWrapper scroll header={headerContent}>
      <View className="gap-4">
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Netflix, Insurance..."
          maxLength={100}
        />

        <Input
          label={`Amount (${currencySymbol})`}
          value={amountText}
          onChangeText={setAmountText}
          placeholder="12.99"
          keyboardType="decimal-pad"
        />

        <ChipGroup
          options={[
            { value: "monthly" as BillingFrequency, label: "Monthly" },
            { value: "yearly" as BillingFrequency, label: "Yearly" },
          ]}
          selected={billingFrequency}
          onSelect={setBillingFrequency}
          compact
        />
      </View>

      <SectionHeader title="Wallet" />

      {wallets.length === 0 ? (
        <Text className="text-sm text-gray-400">
          No wallets yet. Add one from the Wallets tab.
        </Text>
      ) : (
        <ChipGroup
          options={wallets.map((w) => ({ value: w.id, label: w.name }))}
          selected={walletId}
          onSelect={setWalletId}
          compact
        />
      )}

      <SectionHeader title="Options" />

      <FormRow
        label="Essential expense"
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
      <Text className="mt-2 px-1 text-xs text-gray-400">
        Essential expenses are fixed costs you can't avoid, like rent, insurance or subscriptions. They are used to calculate your emergency fund.
      </Text>

      <SectionHeader title="Notes" />

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
          label={isEditing ? "Save changes" : "Save expense"}
          onPress={handleSave}
          loading={saving}
        />

        {isEditing && (
          <View className="mt-3">
            <Button
              label="Delete expense"
              variant="destructive"
              onPress={handleDelete}
            />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}
