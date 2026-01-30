import axios from "axios";
import type {
  Category,
  Account,
  Transaction,
  Transfer,
  Summary,
  PeriodAnalytics,
  CategoryAnalytics,
  DivisionAnalytics,
  CreateTransactionDto,
  CreateTransferDto,
  TransactionFilters,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Categories
export const categoryApi = {
  getAll: () => api.get<Category[]>("/categories").then((res) => res.data),
  getById: (id: string) =>
    api.get<Category>(`/categories/${id}`).then((res) => res.data),
  create: (data: Partial<Category>) =>
    api.post<Category>("/categories", data).then((res) => res.data),
  update: (id: string, data: Partial<Category>) =>
    api.put<Category>(`/categories/${id}`, data).then((res) => res.data),
  delete: (id: string) =>
    api.delete(`/categories/${id}`).then((res) => res.data),
  seed: () => api.post("/categories/seed").then((res) => res.data),
};

// Accounts
export const accountApi = {
  getAll: () => api.get<Account[]>("/accounts").then((res) => res.data),
  getById: (id: string) =>
    api.get<Account>(`/accounts/${id}`).then((res) => res.data),
  getSummary: () => api.get("/accounts/summary").then((res) => res.data),
  create: (data: Partial<Account>) =>
    api.post<Account>("/accounts", data).then((res) => res.data),
  update: (id: string, data: Partial<Account>) =>
    api.put<Account>(`/accounts/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/accounts/${id}`).then((res) => res.data),
  seed: () => api.post("/accounts/seed").then((res) => res.data),
};

// Transactions
export const transactionApi = {
  getAll: (filters?: TransactionFilters & { page?: number; limit?: number }) =>
    api
      .get<PaginatedResponse<Transaction>>("/transactions", { params: filters })
      .then((res) => res.data),
  getRecent: (limit = 10) =>
    api
      .get<Transaction[]>("/transactions/recent", { params: { limit } })
      .then((res) => res.data),
  getById: (id: string) =>
    api.get<Transaction>(`/transactions/${id}`).then((res) => res.data),
  create: (data: CreateTransactionDto) =>
    api.post<Transaction>("/transactions", data).then((res) => res.data),
  update: (id: string, data: Partial<CreateTransactionDto>) =>
    api.put<Transaction>(`/transactions/${id}`, data).then((res) => res.data),
  delete: (id: string) =>
    api.delete(`/transactions/${id}`).then((res) => res.data),
};

// Transfers
export const transferApi = {
  getAll: (params?: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) =>
    api
      .get<PaginatedResponse<Transfer>>("/transfers", { params })
      .then((res) => res.data),
  getById: (id: string) =>
    api.get<Transfer>(`/transfers/${id}`).then((res) => res.data),
  create: (data: CreateTransferDto) =>
    api.post<Transfer>("/transfers", data).then((res) => res.data),
  delete: (id: string) =>
    api.delete(`/transfers/${id}`).then((res) => res.data),
};

// Analytics
export const analyticsApi = {
  getSummary: (params?: {
    startDate?: string;
    endDate?: string;
    division?: string;
  }) =>
    api.get<Summary>("/analytics/summary", { params }).then((res) => res.data),
  getByPeriod: (params?: {
    period?: "weekly" | "monthly" | "yearly";
    year?: number;
    division?: string;
  }) =>
    api
      .get<PeriodAnalytics>("/analytics/by-period", { params })
      .then((res) => res.data),
  getByCategory: (params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    division?: string;
  }) =>
    api
      .get<{
        data: CategoryAnalytics[];
        totalAmount: number;
      }>("/analytics/by-category", { params })
      .then((res) => res.data),
  getByDivision: (params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
  }) =>
    api
      .get<DivisionAnalytics>("/analytics/by-division", { params })
      .then((res) => res.data),
  getByAccount: (params?: { startDate?: string; endDate?: string }) =>
    api.get("/analytics/by-account", { params }).then((res) => res.data),
};

export default api;
