// Category types
export interface Category {
  _id: string;
  name: string;
  type: "income" | "expense" | "both";
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Account types
export interface Account {
  _id: string;
  name: string;
  type: "cash" | "bank" | "wallet";
  balance: number;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Transaction types
export interface Transaction {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: Category;
  account: Account;
  division: "office" | "personal";
  description: string;
  date: string;
  isEditable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: "income" | "expense";
  category: string;
  account: string;
  division?: "office" | "personal";
  description?: string;
  date?: string;
}

// Transfer types
export interface Transfer {
  _id: string;
  fromAccount: Account;
  toAccount: Account;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransferDto {
  fromAccount: string;
  toAccount: string;
  amount: number;
  description?: string;
  date?: string;
}

// Analytics types
export interface Summary {
  income: number;
  expense: number;
  balance: number;
}

export interface PeriodData {
  name: string;
  income: number;
  expense: number;
  balance: number;
}

export interface PeriodAnalytics {
  period: "weekly" | "monthly" | "yearly";
  year: number;
  data: PeriodData[];
}

export interface CategoryAnalytics {
  _id: string;
  name: string;
  icon: string;
  color: string;
  total: number;
  count: number;
  percentage: number;
}

export interface DivisionAnalytics {
  office: Summary;
  personal: Summary;
}

// Filter types
export interface TransactionFilters {
  category?: string;
  account?: string;
  division?: "office" | "personal";
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
}

// Pagination
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  transactions?: T[];
  transfers?: T[];
  totalBalance?: number;
  pagination: Pagination;
}
