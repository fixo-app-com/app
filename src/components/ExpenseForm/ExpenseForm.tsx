import { useEffect, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useData } from "../../contexts/DataContext";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import type {
  BillingFrequency,
  Expense,
  ExpensePriority,
} from "../../types/firestore";
import { getCurrencySymbol } from "../../constants/banks";
import {
  Button,
  ChipGroup,
  FormLabel,
  Input,
  SaveDeleteFooter,
} from "../../design-system";

interface ExpenseFormProps {
  expense?: Expense;
  categoryId?: string;
  onComplete: () => void;
  onNavigateToWallet?: () => void;
}

export function ExpenseForm({
  expense,
  categoryId,
  onComplete,
  onNavigateToWallet,
}: ExpenseFormProps) {
  const { t } = useTranslation();
  const {
    categories,
    wallets,
    currency,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useData();

  const resolvedCategoryId = expense?.categoryId ?? categoryId;
  const category = useMemo(
    () => categories.find((c) => c.id === resolvedCategoryId),
    [categories, resolvedCategoryId],
  );

  const isEditing = !!expense;

  const [name, setName] = useState("");
  const [amountText, setAmountText] = useState("");
  const [billingFrequency, setBillingFrequency] =
    useState<BillingFrequency>("monthly");
  const [walletId, setWalletId] = useState(
    wallets.length > 0 ? wallets[0].id : "",
  );
  const [priority, setPriority] = useState<ExpensePriority>("essential");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { confirmDelete } = useDeleteConfirmation();

  // Auto-select first wallet when wallets become available
  useEffect(() => {
    if (!walletId && wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  // Populate fields from expense prop
  useEffect(() => {
    if (!expense) return;
    setName(expense.name);
    setAmountText((expense.amountCents / 100).toFixed(2));
    setBillingFrequency(expense.billingFrequency ?? "monthly");
    setWalletId(expense.walletId);
    setPriority(expense.priority);
    setNotes(expense.notes);
  }, [expense]);

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
      if (onNavigateToWallet) {
        Alert.alert(
          t("addEditExpense.walletRequiredTitle"),
          t("addEditExpense.walletRequiredMessage"),
          [
            { text: t("common.cancel"), style: "cancel" },
            {
              text: t("addEditExpense.createWallet"),
              onPress: onNavigateToWallet,
            },
          ],
        );
      }
      return;
    }

    setSaving(true);
    try {
      const data = {
        categoryId: resolvedCategoryId ?? "",
        name: trimmedName,
        amountCents,
        billingFrequency,
        walletId,
        priority,
        notes: notes.trim(),
      };

      if (isEditing && expense) {
        await updateExpense(expense.id, data);
      } else {
        await addExpense(data);
      }
      onComplete();
    } catch (error) {
      if (__DEV__) console.error("Failed to save expense:", error);
      Alert.alert(t("common.error"), t("addEditExpense.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!expense) return;

    confirmDelete({
      title: t("addEditExpense.deleteTitle"),
      message: t("addEditExpense.deleteMessage", { name }),
      onConfirm: async () => {
        try {
          await deleteExpense(expense.id);
          onComplete();
        } catch (error) {
          if (__DEV__) console.error("Failed to delete expense:", error);
        }
      },
    });
  }

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <>
      <View className="mb-4">
        <FormLabel title={t("addEditExpense.nameLabel")} />
        <Input
          value={name}
          onChangeText={setName}
          placeholder={t("addEditExpense.namePlaceholder")}
          maxLength={100}
        />
      </View>

      <View className="mb-4">
        <FormLabel
          title={t("addEditExpense.amountLabel", { symbol: currencySymbol })}
        />
        <Input
          value={amountText}
          onChangeText={setAmountText}
          placeholder={t("addEditExpense.amountPlaceholder")}
          keyboardType="decimal-pad"
        />
      </View>

      <View className="mb-4">
        <FormLabel title={t("addEditExpense.frequencyLabel")} />
        <ChipGroup
          options={[
            {
              value: "monthly" as BillingFrequency,
              label: t("common.monthly"),
            },
            {
              value: "yearly" as BillingFrequency,
              label: t("common.yearly"),
            },
          ]}
          selected={billingFrequency}
          onSelect={setBillingFrequency}
          compact
        />
        <Text className="text-xs text-gray-400">
          {t(
            billingFrequency === "monthly"
              ? "addEditExpense.frequencyHintMonthly"
              : "addEditExpense.frequencyHintYearly",
          )}
        </Text>
      </View>

      <View className="mb-4">
        <FormLabel title={t("addEditExpense.walletSection")} />
        {wallets.length === 0 && onNavigateToWallet ? (
          <Button
            label={t("addEditExpense.createWallet")}
            variant="outline"
            onPress={onNavigateToWallet}
          />
        ) : (
          <ChipGroup
            options={wallets.map((w) => ({ value: w.id, label: w.name }))}
            selected={walletId}
            onSelect={setWalletId}
            compact
          />
        )}
      </View>

      <View className="mb-4">
        <FormLabel title={t("addEditExpense.priorityLabel")} />
        <ChipGroup
          options={[
            {
              value: "essential",
              label: t("addEditExpense.priorityEssential"),
            },
            {
              value: "reducible",
              label: t("addEditExpense.priorityReducible"),
            },
            {
              value: "optional",
              label: t("addEditExpense.priorityOptional"),
            },
          ]}
          selected={priority}
          onSelect={setPriority}
          compact
        />
        <Text className="text-xs text-gray-400">
          {t(
            (
              {
                essential: "addEditExpense.priorityHintEssential",
                reducible: "addEditExpense.priorityHintReducible",
                optional: "addEditExpense.priorityHintOptional",
              } as const
            )[priority],
          )}
        </Text>
      </View>

      {category && (
        <View className="mb-4">
          <FormLabel title={t("addEditExpense.categoryLabel")} />
          <View className="flex-row items-center rounded-xl bg-gray-100 px-3 py-2.5">
            <Text className="mr-2 text-base">{category.icon}</Text>
            <Text className="text-sm font-medium text-gray-700">
              {category.name}
            </Text>
          </View>
        </View>
      )}

      <View className="mb-4">
        <FormLabel title={t("addEditExpense.notesSection")} />
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder=""
          multiline
          maxLength={500}
          style={{ minHeight: 80 }}
        />
      </View>

      <View className="flex-1" />

      <SaveDeleteFooter
        saveLabel={
          isEditing
            ? t("addEditExpense.saveChanges")
            : t("addEditExpense.saveExpense")
        }
        onSave={handleSave}
        saving={saving}
        deleteLabel={isEditing ? t("addEditExpense.deleteExpense") : undefined}
        onDelete={isEditing ? handleDelete : undefined}
      />
    </>
  );
}
