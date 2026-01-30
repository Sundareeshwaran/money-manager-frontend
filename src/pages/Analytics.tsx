import { useEffect, useState } from "react";
import { Loader2, Building2, User } from "lucide-react";
import { CategoryPieChart, IncomeExpenseChart } from "@/components/Charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsApi } from "@/services/api";
import type { CategoryAnalytics, DivisionAnalytics, PeriodData } from "@/types";

export function Analytics() {
  const [categoryExpenseData, setCategoryExpenseData] = useState<
    CategoryAnalytics[]
  >([]);
  const [categoryIncomeData, setCategoryIncomeData] = useState<
    CategoryAnalytics[]
  >([]);
  const [divisionData, setDivisionData] = useState<DivisionAnalytics | null>(
    null,
  );
  const [monthlyData, setMonthlyData] = useState<PeriodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [expenseRes, incomeRes, divisionRes, periodRes] =
          await Promise.all([
            analyticsApi.getByCategory({ type: "expense" }),
            analyticsApi.getByCategory({ type: "income" }),
            analyticsApi.getByDivision({}),
            analyticsApi.getByPeriod({ period: "monthly" }),
          ]);

        setCategoryExpenseData(expenseRes.data);
        setCategoryIncomeData(incomeRes.data);
        setDivisionData(divisionRes);
        setMonthlyData(periodRes.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gradient">
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights into your finances
        </p>
      </div>

      {/* Monthly Trend */}
      <IncomeExpenseChart
        data={monthlyData}
        title="Monthly Income vs Expense"
      />

      {/* Division Summary */}
      {divisionData && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Office Card */}
          <Card className="bg-linear-to-br from-blue-500/10 to-indigo-600/5 hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-blue-100">
                Office
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-muted-foreground">Income</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(divisionData.office.income)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-muted-foreground">Expense</span>
                <span className="font-semibold text-rose-400">
                  {formatCurrency(divisionData.office.expense)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 px-3">
                <span className="font-medium">Net Balance</span>
                <span
                  className={`text-xl font-bold ${divisionData.office.balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {formatCurrency(divisionData.office.balance)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Personal Card */}
          <Card className="bg-linear-to-br from-purple-500/10 to-pink-600/5 hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <User className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-purple-100">
                Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-muted-foreground">Income</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(divisionData.personal.income)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-muted-foreground">Expense</span>
                <span className="font-semibold text-rose-400">
                  {formatCurrency(divisionData.personal.expense)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 px-3">
                <span className="font-medium">Net Balance</span>
                <span
                  className={`text-xl font-bold ${divisionData.personal.balance >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {formatCurrency(divisionData.personal.balance)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Breakdown */}
      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="expense" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Category Breakdown</h2>
              <TabsList className="bg-white/5 border border-white/10 rounded-xl p-1 h-auto">
                <TabsTrigger
                  value="expense"
                  className="rounded-lg data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-400 h-9"
                >
                  Expenses
                </TabsTrigger>
                <TabsTrigger
                  value="income"
                  className="rounded-lg data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 h-9"
                >
                  Income
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="expense" className="mt-0">
              <div className="grid gap-8 lg:grid-cols-2">
                <CategoryPieChart
                  data={categoryExpenseData}
                  title="Expense Distribution"
                />
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {categoryExpenseData.map((cat) => (
                    <div
                      key={cat._id}
                      className="rounded-xl border border-white/5 bg-background/50 p-4 flex items-center justify-between hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: cat.color,
                            boxShadow: `0 0 10px ${cat.color}`,
                          }}
                        />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(cat.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cat.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="income" className="mt-0">
              <div className="grid gap-8 lg:grid-cols-2">
                <CategoryPieChart
                  data={categoryIncomeData}
                  title="Income Distribution"
                />
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {categoryIncomeData.map((cat) => (
                    <div
                      key={cat._id}
                      className="rounded-xl border border-white/5 bg-background/50 p-4 flex items-center justify-between hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: cat.color,
                            boxShadow: `0 0 10px ${cat.color}`,
                          }}
                        />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(cat.total)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cat.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
