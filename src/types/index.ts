export type TransactionType = 'expense' | 'income';

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Health'
  | 'Entertainment'
  | 'Other';

export type IncomeCategory = 'Salary' | 'Freelance' | 'Gift' | 'Other';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: ExpenseCategory | IncomeCategory;
  note?: string;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface UserProfile {
  name: string;
  currency: string;
  isOnboarded: boolean;
}

export interface AppContextType {
  transactions: Transaction[];
  profile: UserProfile;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  editTransaction: (id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteAllByType: (type: TransactionType) => Promise<void>;
  updateProfile: (profile: UserProfile) => Promise<void>;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  isLoading: boolean;
}
