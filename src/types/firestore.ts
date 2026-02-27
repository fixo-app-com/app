export interface Category {
  id: string;
  name: string; // "Famiglia", "Auto", etc.
  icon: string; // emoji
  createdAt: Date;
}

export interface Expense {
  id: string;
  categoryId: string;
  name: string; // "Netflix", "Assicurazione"
  amountCents: number; // 1299 = €12.99
  walletId: string;
  essential: boolean; // "costo fisso" flag
  notes: string;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  name: string; // "Intesa Sanpaolo", "Revolut"
  createdAt: Date;
}
