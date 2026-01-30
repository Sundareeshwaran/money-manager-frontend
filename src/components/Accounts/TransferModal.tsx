import { useState } from "react";
import { ArrowDown, IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useUIStore, useAccountStore } from "@/stores";
import { transferApi } from "@/services/api";

export function TransferModal() {
  const { isTransferOpen, closeTransfer } = useUIStore();
  const { accounts, fetchAccounts } = useAccountStore();

  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (fromAccount === toAccount) {
      setError("Cannot transfer to the same account");
      return;
    }

    setLoading(true);

    try {
      await transferApi.create({
        fromAccount,
        toAccount,
        amount: parseFloat(amount),
        description,
      });

      await fetchAccounts();
      closeTransfer();
      setFromAccount("");
      setToAccount("");
      setAmount("");
      setDescription("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create transfer";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    closeTransfer();
  };

  const fromAccountData = accounts.find((a) => a._id === fromAccount);

  return (
    <Dialog open={isTransferOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] bg-background/95 backdrop-blur-xl border-white/10 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">
            Transfer Money
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm">
              {error}
            </div>
          )}

          {/* From Account */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">From Account</Label>
            <Select value={fromAccount} onValueChange={setFromAccount} required>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem
                    key={acc._id}
                    value={acc._id}
                    className="focus:bg-primary/20"
                  >
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: acc.color }}
                        />
                        {acc.name}
                      </div>
                      <span className="text-muted-foreground">
                        ₹{acc.balance.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arrow */}
          <div className="flex justify-center py-1">
            <div className="p-2.5 rounded-xl bg-primary/20 text-primary">
              <ArrowDown className="h-5 w-5" />
            </div>
          </div>

          {/* To Account */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">To Account</Label>
            <Select value={toAccount} onValueChange={setToAccount} required>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  .filter((a) => a._id !== fromAccount)
                  .map((acc) => (
                    <SelectItem
                      key={acc._id}
                      value={acc._id}
                      className="focus:bg-primary/20"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: acc.color }}
                        />
                        {acc.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

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
                max={fromAccountData?.balance}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            {fromAccountData && (
              <p className="text-xs text-muted-foreground">
                Available: ₹{fromAccountData.balance.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Note (Optional)</Label>
            <Input
              placeholder="What's this transfer for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 bg-white/5 border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Submit */}
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
              disabled={loading || !fromAccount || !toAccount || !amount}
              className="flex-1 h-12 rounded-xl font-semibold bg-linear-to-r from-primary to-indigo-600 hover:opacity-90 shadow-lg shadow-primary/30"
            >
              {loading ? "Transferring..." : "Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
