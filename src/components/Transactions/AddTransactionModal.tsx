import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useUIStore,
  useCategoryStore,
  useAccountStore,
  useTransactionStore,
} from "@/stores";
import { transactionApi } from "@/services/api";
import type { CreateTransactionDto } from "@/types";

export function AddTransactionModal() {
  const {
    isAddTransactionOpen,
    closeAddTransaction,
    transactionType,
    editingTransaction,
  } = useUIStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { accounts, fetchAccounts } = useAccountStore();
  const { addTransaction, updateTransaction, fetchRecentTransactions } =
    useTransactionStore();

  const [type, setType] = useState<"income" | "expense">(transactionType);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [division, setDivision] = useState<"personal" | "office">("personal");
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAddTransactionOpen) {
      fetchCategories();
      fetchAccounts();
    }
  }, [isAddTransactionOpen, fetchCategories, fetchAccounts]);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category._id);
      setAccount(editingTransaction.account._id);
      setDivision(editingTransaction.division);
      setDate(new Date(editingTransaction.date));
    } else {
      setType(transactionType);
      setAmount("");
      setDescription("");
      setCategory("");
      setAccount("");
      setDivision("personal");
      setDate(new Date());
    }
  }, [editingTransaction, transactionType]);

  const filteredCategories = categories.filter(
    (cat) => cat.type === type || cat.type === "both",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data: CreateTransactionDto = {
        amount: parseFloat(amount),
        type,
        category,
        account,
        division,
        description,
        date: date.toISOString(),
      };

      if (editingTransaction) {
        const updated = await transactionApi.update(
          editingTransaction._id,
          data,
        );
        updateTransaction(updated);
      } else {
        const created = await transactionApi.create(data);
        addTransaction(created);
      }

      await fetchAccounts();
      await fetchRecentTransactions();
      closeAddTransaction();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save transaction";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    closeAddTransaction();
  };

  return (
    <Dialog open={isAddTransactionOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] bg-background/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={type}
          onValueChange={(v) => setType(v as "income" | "expense")}
          className="w-full"
        >
          <div className="px-6">
            <TabsList className="w-full h-12 p-1 bg-white/5 rounded-xl">
              <TabsTrigger
                value="income"
                className="flex-1 h-10 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                Income
              </TabsTrigger>
              <TabsTrigger
                value="expense"
                className="flex-1 h-10 rounded-lg data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                Expense
              </TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm">
                {error}
              </div>
            )}

            <TabsContent value={type} className="mt-0 space-y-4">
              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Amount</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-white/10">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-muted-foreground">Description</Label>
                <Input
                  placeholder="What was this for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {filteredCategories.map((cat) => (
                        <SelectItem
                          key={cat._id}
                          value={cat._id}
                          className="focus:bg-primary/20"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Account */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Account</Label>
                  <Select value={account} onValueChange={setAccount} required>
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      {accounts.map((acc) => (
                        <SelectItem
                          key={acc._id}
                          value={acc._id}
                          className="focus:bg-primary/20"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: acc.color }}
                            />
                            {acc.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Division */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Division</Label>
                  <Select
                    value={division}
                    onValueChange={(v) =>
                      setDivision(v as "personal" | "office")
                    }
                  >
                    <SelectTrigger className="h-11 bg-white/5 border-white/10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10">
                      <SelectItem
                        value="personal"
                        className="focus:bg-primary/20"
                      >
                        Personal
                      </SelectItem>
                      <SelectItem
                        value="office"
                        className="focus:bg-primary/20"
                      >
                        Office
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-11 justify-start bg-white/5 border-white/10 rounded-xl hover:bg-white/10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {format(date, "MMM dd")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 glass border-white/10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 h-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !amount || !category || !account}
                className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                  type === "income"
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30"
                    : "bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/30"
                }`}
              >
                {loading ? "Saving..." : editingTransaction ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
