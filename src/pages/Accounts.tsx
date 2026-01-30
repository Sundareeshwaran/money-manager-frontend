import { useEffect, useState } from "react";
import { Plus, Loader2, ArrowRight, Wallet } from "lucide-react";
import { AccountCard } from "@/components/Accounts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountStore, useUIStore } from "@/stores";
import { transferApi } from "@/services/api";
import type { Transfer } from "@/types";
import { format } from "date-fns";

export function Accounts() {
  const { accounts, loading, fetchAccounts } = useAccountStore();
  const openTransfer = useUIStore((state) => state.openTransfer);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(false);

  useEffect(() => {
    fetchAccounts();

    const fetchTransfers = async () => {
      setLoadingTransfers(true);
      try {
        const response = await transferApi.getAll({ limit: 10 });
        setTransfers(response.transfers || []);
      } catch (error) {
        console.error("Failed to fetch transfers:", error);
      } finally {
        setLoadingTransfers(false);
      }
    };

    fetchTransfers();
  }, [fetchAccounts]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading accounts...</p>
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
            Accounts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your accounts and transfers
          </p>
        </div>
        <Button
          onClick={openTransfer}
          className="bg-linear-to-r from-primary to-indigo-600 hover:opacity-90 rounded-xl h-11 px-6 shadow-lg shadow-primary/30"
        >
          <Plus className="h-4 w-4 mr-2" />
          Transfer Money
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-linear-to-br from-violet-500/20 to-purple-600/10 border-border/50">
        <CardContent className="p-6 lg:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-violet-500/20">
              <Wallet className="h-8 w-8 text-violet-400" />
            </div>
            <div>
              <p className="text-muted-foreground">Total Balance</p>
              <p className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-white/80">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalBalance)}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Across {accounts.length} accounts
          </p>
        </CardContent>
      </Card>

      {/* Account Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account._id} account={account} />
        ))}
      </div>

      {/* Recent Transfers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Transfers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTransfers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No transfers yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.map((transfer) => (
                <div
                  key={transfer._id}
                  className="rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {transfer.fromAccount?.name} →{" "}
                          {transfer.toAccount?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transfer.description || "Transfer"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₹{transfer.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transfer.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
