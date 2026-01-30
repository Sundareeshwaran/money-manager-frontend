import { create } from "zustand";
import type {
  Category,
  Account,
  Transaction,
  Summary,
  TransactionFilters,
} from "@/types";
import {
  categoryApi,
  accountApi,
  transactionApi,
  analyticsApi,
} from "@/services/api";

// Category Store
interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  seedCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await categoryApi.getAll();
      set({ categories, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch categories", loading: false });
    }
  },
  seedCategories: async () => {
    try {
      await categoryApi.seed();
      const categories = await categoryApi.getAll();
      set({ categories });
    } catch (err) {
      set({ error: "Failed to seed categories" });
    }
  },
}));

// Account Store
interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  seedAccounts: () => Promise<void>;
  updateAccountBalance: (id: string, balance: number) => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  loading: false,
  error: null,
  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const accounts = await accountApi.getAll();
      set({ accounts, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch accounts", loading: false });
    }
  },
  seedAccounts: async () => {
    try {
      await accountApi.seed();
      const accounts = await accountApi.getAll();
      set({ accounts });
    } catch (err) {
      set({ error: "Failed to seed accounts" });
    }
  },
  updateAccountBalance: (id, balance) => {
    const { accounts } = get();
    set({
      accounts: accounts.map((acc) =>
        acc._id === id ? { ...acc, balance } : acc,
      ),
    });
  },
}));

// Transaction Store
interface TransactionState {
  transactions: Transaction[];
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  pagination: { total: number; page: number; pages: number };
  filters: TransactionFilters;
  fetchTransactions: (
    filters?: TransactionFilters & { page?: number },
  ) => Promise<void>;
  fetchRecentTransactions: (limit?: number) => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  recentTransactions: [],
  loading: false,
  error: null,
  pagination: { total: 0, page: 1, pages: 0 },
  filters: {},
  fetchTransactions: async (filters) => {
    set({ loading: true, error: null });
    try {
      const response = await transactionApi.getAll({
        ...get().filters,
        ...filters,
      });
      set({
        transactions: response.transactions || [],
        pagination: response.pagination,
        loading: false,
      });
    } catch (err) {
      set({ error: "Failed to fetch transactions", loading: false });
    }
  },
  fetchRecentTransactions: async (limit = 10) => {
    try {
      const transactions = await transactionApi.getRecent(limit);
      set({ recentTransactions: transactions });
    } catch (err) {
      console.error("Failed to fetch recent transactions");
    }
  },
  addTransaction: (transaction) => {
    set((state) => ({
      transactions: [transaction, ...state.transactions],
      recentTransactions: [
        transaction,
        ...state.recentTransactions.slice(0, 9),
      ],
    }));
  },
  updateTransaction: (transaction) => {
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t._id === transaction._id ? transaction : t,
      ),
      recentTransactions: state.recentTransactions.map((t) =>
        t._id === transaction._id ? transaction : t,
      ),
    }));
  },
  removeTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t._id !== id),
      recentTransactions: state.recentTransactions.filter((t) => t._id !== id),
    }));
  },
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },
  clearFilters: () => {
    set({ filters: {} });
  },
}));

// Dashboard Store
interface DashboardState {
  summary: Summary;
  period: "weekly" | "monthly" | "yearly";
  loading: boolean;
  error: string | null;
  fetchSummary: (params?: {
    startDate?: string;
    endDate?: string;
    division?: string;
  }) => Promise<void>;
  setPeriod: (period: "weekly" | "monthly" | "yearly") => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: { income: 0, expense: 0, balance: 0 },
  period: "monthly",
  loading: false,
  error: null,
  fetchSummary: async (params) => {
    set({ loading: true, error: null });
    try {
      const summary = await analyticsApi.getSummary(params);
      set({ summary, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch summary", loading: false });
    }
  },
  setPeriod: (period) => set({ period }),
}));

// UI Store for modals and app state
interface UIState {
  isAddTransactionOpen: boolean;
  isTransferOpen: boolean;
  transactionType: "income" | "expense";
  editingTransaction: Transaction | null;
  openAddTransaction: (type?: "income" | "expense") => void;
  closeAddTransaction: () => void;
  openTransfer: () => void;
  closeTransfer: () => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAddTransactionOpen: false,
  isTransferOpen: false,
  transactionType: "expense",
  editingTransaction: null,
  openAddTransaction: (type = "expense") =>
    set({ isAddTransactionOpen: true, transactionType: type }),
  closeAddTransaction: () =>
    set({ isAddTransactionOpen: false, editingTransaction: null }),
  openTransfer: () => set({ isTransferOpen: true }),
  closeTransfer: () => set({ isTransferOpen: false }),
  setEditingTransaction: (transaction) =>
    set({
      editingTransaction: transaction,
      isAddTransactionOpen: !!transaction,
    }),
}));
