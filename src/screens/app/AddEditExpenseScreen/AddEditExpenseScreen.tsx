import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "../../../contexts/AuthContext";
import { getExpenses } from "../../../services/firestore";
import { useStoreReview } from "../../../hooks/useStoreReview";
import type { CategoriesStackParamList } from "../../../navigation/RootNavigator";
import type { Expense } from "../../../types/firestore";
import {
  FullScreenLoader,
  ScreenHeader,
  ScreenWrapper,
} from "../../../design-system";
import { ExpenseForm } from "../../../components";

type Nav = NativeStackNavigationProp<
  CategoriesStackParamList,
  "AddEditExpense"
>;
type Route = RouteProp<CategoriesStackParamList, "AddEditExpense">;

export default function AddEditExpenseScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { categoryId, expenseId } = route.params;
  const { user } = useAuth();

  const isEditing = !!expenseId;

  const [loadedExpense, setLoadedExpense] = useState<Expense | undefined>();
  const [loadingExpense, setLoadingExpense] = useState(isEditing);

  const { promptIfEligible } = useStoreReview();

  useEffect(() => {
    if (!isEditing || !user) return;

    async function loadExpense() {
      try {
        const allExpenses = await getExpenses(user!.uid, { categoryId });
        const expense = allExpenses.find((e: Expense) => e.id === expenseId);
        if (expense) {
          setLoadedExpense(expense);
        }
      } catch (error) {
        if (__DEV__) console.error("Failed to load expense:", error);
      } finally {
        setLoadingExpense(false);
      }
    }

    loadExpense();
  }, [isEditing, user, categoryId, expenseId]);

  if (loadingExpense) {
    return <FullScreenLoader />;
  }

  const headerContent = (
    <ScreenHeader
      title={
        isEditing ? t("addEditExpense.editTitle") : t("addEditExpense.newTitle")
      }
      onBack={() => navigation.goBack()}
    />
  );

  return (
    <ScreenWrapper scroll header={headerContent}>
      <ExpenseForm
        expense={loadedExpense}
        categoryId={categoryId}
        onComplete={() => {
          if (!isEditing) promptIfEligible();
          navigation.goBack();
        }}
        onNavigateToWallet={() => navigation.navigate("AddEditWallet", {})}
      />
    </ScreenWrapper>
  );
}
