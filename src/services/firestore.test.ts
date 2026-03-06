import firestore from "@react-native-firebase/firestore";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addExpense,
  updateExpense,
  deleteExpense,
  addWallet,
  updateWallet,
  deleteWallet,
} from "./firestore";

// Create a stable firestore instance shared across all firestore() calls
const mockUpdate = jest.fn();
const mockDeleteDoc = jest.fn();
const mockAdd = jest.fn(() => Promise.resolve({ id: "mock-id" }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDoc = jest.fn((): any => ({
  collection: mockCollection,
  update: mockUpdate,
  delete: mockDeleteDoc,
  set: jest.fn(),
  onSnapshot: jest.fn(),
}));

const mockOrderBy = jest.fn(() => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSnapshot: jest.fn((...args: any[]) => {
    const onResult = typeof args[0] === "function" ? args[0] : args[0];
    if (typeof onResult === "function") onResult({ docs: [] });
    return jest.fn();
  }),
  get: jest.fn(() => Promise.resolve({ docs: [], empty: true, size: 0 })),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockWhere = jest.fn((): any => ({
  where: mockWhere,
  orderBy: mockOrderBy,
  get: jest.fn(() => Promise.resolve({ docs: [], empty: true, size: 0 })),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockCollection = jest.fn((): any => ({
  doc: mockDoc,
  add: mockAdd,
  where: mockWhere,
  orderBy: mockOrderBy,
  get: jest.fn(() => Promise.resolve({ docs: [], empty: true, size: 0 })),
}));

const mockFirestoreInstance = {
  collection: mockCollection,
  batch: jest.fn(() => ({
    delete: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
};

beforeEach(() => {
  (firestore as unknown as jest.Mock).mockReturnValue(mockFirestoreInstance);
});

describe("firestore service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (firestore as unknown as jest.Mock).mockReturnValue(mockFirestoreInstance);
  });

  // --- Categories ---

  describe("addCategory", () => {
    it("adds a category with server timestamp", async () => {
      const id = await addCategory("uid", { name: "Food", icon: "🍔" });
      expect(id).toBe("mock-id");
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Food", icon: "🍔" }),
      );
    });
  });

  describe("updateCategory", () => {
    it("updates a category document", async () => {
      await updateCategory("uid", "cat1", { name: "Updated" });
      expect(mockUpdate).toHaveBeenCalledWith({ name: "Updated" });
    });
  });

  describe("deleteCategory", () => {
    it("deletes a category document", async () => {
      await deleteCategory("uid", "cat1");
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });

  // --- Expenses ---

  describe("addExpense", () => {
    it("adds an expense with server timestamp", async () => {
      const data = {
        categoryId: "cat1",
        name: "Netflix",
        amountCents: 1299,
        billingFrequency: "monthly" as const,
        walletId: "w1",
        essential: false,
        notes: "",
      };
      const id = await addExpense("uid", data);
      expect(id).toBe("mock-id");
      expect(mockAdd).toHaveBeenCalled();
    });
  });

  describe("updateExpense", () => {
    it("updates an expense document", async () => {
      await updateExpense("uid", "e1", { name: "Hulu" });
      expect(mockUpdate).toHaveBeenCalledWith({ name: "Hulu" });
    });
  });

  describe("deleteExpense", () => {
    it("deletes an expense document", async () => {
      await deleteExpense("uid", "e1");
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });

  // --- Wallets ---

  describe("addWallet", () => {
    it("adds a wallet with server timestamp", async () => {
      const id = await addWallet("uid", { name: "Revolut", icon: "revolut" });
      expect(id).toBe("mock-id");
      expect(mockAdd).toHaveBeenCalled();
    });
  });

  describe("updateWallet", () => {
    it("updates a wallet document", async () => {
      await updateWallet("uid", "w1", { name: "N26" });
      expect(mockUpdate).toHaveBeenCalledWith({ name: "N26" });
    });
  });

  describe("deleteWallet", () => {
    it("deletes a wallet document", async () => {
      await deleteWallet("uid", "w1");
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
