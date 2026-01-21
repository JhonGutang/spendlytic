export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  category_id: number;
  category?: Category;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Summary {
  total_income: number;
  total_expenses: number;
  net_balance: number;
  transaction_count: number;
}

export interface ExpenseByCategory {
  category_id: number;
  category: Category;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number | string;
  date: string;
  category_id: number | null | '';
  description?: string;
}

export interface CategoryFormData {
  name: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}
