import { useEffect, useState } from "react";
import {
  SummaryCard,
  PeriodSelector,
  TransactionTable,
} from "@/components/Dashboard";
import { IncomeExpenseChart, CategoryPieChart } from "@/components/Charts";
import {
  useDashboardStore,
  useTransactionStore,
  useCategoryStore,
  useAccountStore,
} from "@/stores";
import { analyticsApi, categoryApi, accountApi } from "@/services/api";
import type { PeriodData, CategoryAnalytics } from "@/types";
import { Loader2, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  const { summary, period, fetchSummary } = useDashboardStore();
  const { recentTransactions, fetchRecentTransactions } = useTransactionStore();
  const { seedCategories } = useCategoryStore();
  const { seedAccounts } = useAccountStore();

  const [periodData, setPeriodData] = useState<PeriodData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize app with seed data
  useEffect(() => {
    const initializeApp = async () => {
      if (initialized) return;

      try {
        await Promise.all([
          categoryApi.seed().catch(() => {}),
          accountApi.seed().catch(() => {}),
        ]);
        await Promise.all([seedCategories(), seedAccounts()]);
        setInitialized(true);
      } catch (error) {
        console.error("Failed to initialize:", error);
      }
    };

    initializeApp();
  }, [initialized, seedCategories, seedAccounts]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSummary(), fetchRecentTransactions(10)]);

        const [periodResponse, categoryResponse] = await Promise.all([
          analyticsApi.getByPeriod({ period }),
          analyticsApi.getByCategory({ type: "expense" }),
        ]);

        setPeriodData(periodResponse.data);
        setCategoryData(categoryResponse.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, fetchSummary, fetchRecentTransactions]);

  if (loading && !initialized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your income and expenses
          </p>
        </div>
        <PeriodSelector />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Income"
          amount={summary.income}
          type="income"
        />
        <SummaryCard
          title="Total Expense"
          amount={summary.expense}
          type="expense"
        />
        <SummaryCard title="Balance" amount={summary.balance} type="balance" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <IncomeExpenseChart
          data={periodData}
          title={`${period.charAt(0).toUpperCase() + period.slice(1)} Overview`}
        />
        <CategoryPieChart data={categoryData} title="Expense Categories" />
      </div>

      {/* Recent Transactions */}
      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-lg font-semibold">
            Recent Transactions
          </CardTitle>
          <a
            href="/transactions"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={recentTransactions}
            showActions={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
