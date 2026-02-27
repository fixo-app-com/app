import { useEffect, useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { useData } from "../../../contexts/DataContext";
import {
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenses,
} from "../../../services/firestore";
import type { CategoriesStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
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

type Nav = NativeStackNavigationProp<
  CategoriesStackParamList,
  "AddEditExpense"
>;
type Route = RouteProp<CategoriesStackParamList, "AddEditExpense">;

export default function AddEditExpenseScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, expenseId } = route.params;
  const { user } = useAuth();
  const { wallets, currency } = useData();

  const isEditing = !!expenseId;

  const [name, setName] = useState("");
  const [amountText, setAmountText] = useState("");
  const [walletId, setWalletId] = useState("");
  const [essential, setEssential] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingExpense, setLoadingExpense] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !user) return;

    async function loadExpense() {
      try {
        const allExpenses = await getExpenses(user!.uid, categoryId);
        const expense = allExpenses.find((e: Expense) => e.id === expenseId);
        if (expense) {
          setName(expense.name);
          setAmountText((expense.amountCents / 100).toFixed(2));
          setWalletId(expense.walletId);
          setEssential(expense.essential);
          setNotes(expense.notes);
        }
      } catch (error) {
        console.error("Failed to load expense:", error);
      } finally {
        setLoadingExpense(false);
      }
    }

    loadExpense();
  }, [isEditing, user, categoryId, expenseId]);

  function parseAmount(text: string): number | null {
    const cleaned = text.replace(",", ".");
    const num = parseFloat(cleaned);
    if (isNaN(num) || num < 0) return null;
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
        walletId,
        essential,
        notes: notes.trim(),
      };

      if (isEditing && expenseId) {
        await updateExpense(user.uid, expenseId, data);
      } else {
        await addExpense(user.uid, data);
      }
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save expense:", error);
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
            await deleteExpense(user.uid, expenseId);
            navigation.goBack();
          } catch (error) {
            console.error("Failed to delete expense:", error);
          }
        },
      },
    ]);
  }

  if (loadingExpense) {
    return <FullScreenLoader />;
  }

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <ScreenWrapper scroll>
      <ScreenHeader
        title={isEditing ? "Edit expense" : "New expense"}
        onBack={() => navigation.goBack()}
      />

      <SectionHeader title="Details" />

      <View className="gap-4">
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Netflix, Insurance..."
        />

        <Input
          label={`Amount (${currencySymbol})`}
          value={amountText}
          onChangeText={setAmountText}
          placeholder="12.99"
          keyboardType="decimal-pad"
        />
      </View>

      <SectionHeader title="Wallet" />

      {wallets.length === 0 ? (
        <Text className="text-sm text-gray-500">
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
            trackColor={{ false: "#374151", true: "#818cf8" }}
            thumbColor="#fff"
          />
        }
      />

      <SectionHeader title="Notes" />

      <Input
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional notes..."
        multiline
        style={{ minHeight: 80 }}
      />

      <View className="mb-6" />

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

      <View className="mb-8" />
    </ScreenWrapper>
  );
}
