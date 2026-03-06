import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import type {
  Category,
  Expense,
  UserSettings,
  Wallet,
} from "../types/firestore";

// --- Helpers ---

function usersRef() {
  return firestore().collection("users");
}

function categoriesRef(userId: string) {
  return usersRef().doc(userId).collection("categories");
}

function expensesRef(userId: string) {
  return usersRef().doc(userId).collection("expenses");
}

function walletsRef(userId: string) {
  return usersRef().doc(userId).collection("wallets");
}

// --- Categories ---

export function subscribeCategories(
  userId: string,
  onResult: (categories: Category[]) => void,
  onError: (error: Error) => void,
): () => void {
  return categoriesRef(userId)
    .orderBy("createdAt", "asc")
    .onSnapshot(
      (snapshot) => {
        const categories: Category[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        })) as Category[];
        onResult(categories);
      },
      (error) => onError(error),
    );
}

export async function addCategory(
  userId: string,
  data: Pick<Category, "name" | "icon">,
): Promise<string> {
  const ref = await categoriesRef(userId).add({
    name: data.name,
    icon: data.icon,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  data: Partial<Pick<Category, "name" | "icon">>,
): Promise<void> {
  await categoriesRef(userId).doc(categoryId).update(data);
}

export async function deleteCategory(
  userId: string,
  categoryId: string,
): Promise<void> {
  await categoriesRef(userId).doc(categoryId).delete();
}

// --- Expenses ---

export async function getExpenses(
  userId: string,
  filter?: { categoryId?: string; walletId?: string },
): Promise<Expense[]> {
  let query: FirebaseFirestoreTypes.Query = expensesRef(userId);

  if (filter?.categoryId) {
    query = query.where("categoryId", "==", filter.categoryId);
  }
  if (filter?.walletId) {
    query = query.where("walletId", "==", filter.walletId);
  }

  if (!filter?.walletId) {
    query = query.orderBy("amountCents", "desc");
  }

  const snapshot = await query.get();
  const expenses = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() ?? new Date(),
  })) as Expense[];

  if (filter?.walletId) {
    expenses.sort((a, b) => b.amountCents - a.amountCents);
  }

  return expenses;
}

export async function addExpense(
  userId: string,
  data: Omit<Expense, "id" | "createdAt">,
): Promise<string> {
  const ref = await expensesRef(userId).add({
    ...data,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateExpense(
  userId: string,
  expenseId: string,
  data: Partial<Omit<Expense, "id" | "createdAt">>,
): Promise<void> {
  await expensesRef(userId).doc(expenseId).update(data);
}

export async function deleteExpense(
  userId: string,
  expenseId: string,
): Promise<void> {
  await expensesRef(userId).doc(expenseId).delete();
}

export async function deleteExpensesByCategory(
  userId: string,
  categoryId: string,
): Promise<number> {
  const snapshot = await expensesRef(userId)
    .where("categoryId", "==", categoryId)
    .get();
  await batchDeleteDocs(snapshot.docs);
  return snapshot.size;
}

// --- Wallets ---

export function subscribeWallets(
  userId: string,
  onResult: (wallets: Wallet[]) => void,
  onError: (error: Error) => void,
): () => void {
  return walletsRef(userId)
    .orderBy("createdAt", "asc")
    .onSnapshot(
      (snapshot) => {
        const wallets: Wallet[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() ?? new Date(),
        })) as Wallet[];
        onResult(wallets);
      },
      (error) => onError(error),
    );
}

export async function addWallet(
  userId: string,
  data: Pick<Wallet, "name" | "icon">,
): Promise<string> {
  const ref = await walletsRef(userId).add({
    name: data.name,
    icon: data.icon,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateWallet(
  userId: string,
  walletId: string,
  data: Partial<Pick<Wallet, "name" | "icon">>,
): Promise<void> {
  await walletsRef(userId).doc(walletId).update(data);
}

export async function deleteWallet(
  userId: string,
  walletId: string,
): Promise<void> {
  await walletsRef(userId).doc(walletId).delete();
}

// --- Batch Helpers ---

async function batchDeleteDocs(
  docs: FirebaseFirestoreTypes.QueryDocumentSnapshot[],
): Promise<void> {
  for (let i = 0; i < docs.length; i += 500) {
    const batch = firestore().batch();
    docs.slice(i, i + 500).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

// --- Account Deletion ---

async function deleteCollection(
  ref: FirebaseFirestoreTypes.CollectionReference,
): Promise<void> {
  const snapshot = await ref.get();
  if (snapshot.empty) return;
  await batchDeleteDocs(snapshot.docs);
}

export async function deleteAllUserData(userId: string): Promise<void> {
  await deleteCollection(categoriesRef(userId));
  await deleteCollection(expensesRef(userId));
  await deleteCollection(walletsRef(userId));
  await usersRef().doc(userId).delete();
}

// --- User Settings ---

const DEFAULT_SETTINGS: UserSettings = {
  currency: "EUR",
  monthlyBudgetCents: 0,
  emergencyMonths: 6,
  language: undefined,
};

export function subscribeUserSettings(
  userId: string,
  onResult: (settings: UserSettings) => void,
  onError: (error: Error) => void,
): () => void {
  return usersRef()
    .doc(userId)
    .onSnapshot(
      (snapshot) => {
        const data = snapshot.data();
        onResult({
          currency: data?.currency ?? DEFAULT_SETTINGS.currency,
          monthlyBudgetCents:
            data?.monthlyBudgetCents ?? DEFAULT_SETTINGS.monthlyBudgetCents,
          emergencyMonths:
            data?.emergencyMonths ?? DEFAULT_SETTINGS.emergencyMonths,
          language: data?.language ?? DEFAULT_SETTINGS.language,
        });
      },
      (error) => onError(error),
    );
}

export async function updateUserSettings(
  userId: string,
  data: Partial<UserSettings>,
): Promise<void> {
  await usersRef().doc(userId).set(data, { merge: true });
}
