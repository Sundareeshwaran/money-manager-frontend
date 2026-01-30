import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Loader2,
  X,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { TransactionTable } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useTransactionStore,
  useCategoryStore,
  useAccountStore,
} from "@/stores";
import { transactionApi } from "@/services/api";

export function Transactions() {
  const {
    transactions,
    pagination,
    loading,
    filters,
    fetchTransactions,
    removeTransaction,
    setFilters,
    clearFilters,
  } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { accounts, fetchAccounts } = useAccountStore();

  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    fetchCategories();
    fetchAccounts();
  }, [fetchCategories, fetchAccounts]);

  useEffect(() => {
    fetchTransactions({
      ...filters,
      page,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  }, [filters, page, startDate, endDate, fetchTransactions]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await transactionApi.delete(id);
      removeTransaction(id);
      await fetchAccounts();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setStartDate(undefined);
    setEndDate(undefined);
    setPage(1);
  };

  const activeFilters =
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(filters).filter(([_, v]) => v).length +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gradient">
          Transactions
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your transactions
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
            {activeFilters > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Type Filter */}
            <Select
              value={filters.type || "all"}
              onValueChange={(v) =>
                setFilters({
                  type: v === "all" ? undefined : (v as "income" | "expense"),
                })
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    Income
                  </div>
                </SelectItem>
                <SelectItem value="expense">
                  <div className="flex items-center gap-2">
                    <ArrowDownRight className="h-4 w-4 text-rose-400" />
                    Expense
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select
              value={filters.category || "all"}
              onValueChange={(v) =>
                setFilters({ category: v === "all" ? undefined : v })
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Account Filter */}
            <Select
              value={filters.account || "all"}
              onValueChange={(v) =>
                setFilters({ account: v === "all" ? undefined : v })
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((acc) => (
                  <SelectItem key={acc._id} value={acc._id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Division Filter */}
            <Select
              value={filters.division || "all"}
              onValueChange={(v) =>
                setFilters({
                  division:
                    v === "all" ? undefined : (v as "office" | "personal"),
                })
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start h-11 rounded-xl"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {startDate ? format(startDate, "MMM dd") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start h-11 rounded-xl"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {endDate ? format(endDate, "MMM dd") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              All Transactions
            </CardTitle>
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary hover:bg-primary/30"
            >
              {pagination.total} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <TransactionTable
                transactions={transactions}
                showActions={true}
                onDelete={handleDelete}
              />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="hover:bg-accent"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-4 text-sm font-medium border rounded-md">
                    Page {page} of {pagination.pages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPage((p) => Math.min(pagination.pages, p + 1))
                    }
                    disabled={page === pagination.pages}
                    className="hover:bg-accent"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
