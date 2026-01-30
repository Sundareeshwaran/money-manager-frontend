import { useState } from "react";
import {
  Wallet,
  Building2,
  CreditCard,
  ArrowRightLeft,
  TrendingUp,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Account } from "@/types";
import { useUIStore } from "@/stores";
import { EditAccountDialog } from "./EditAccountDialog";

interface AccountCardProps {
  account: Account;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getAccountIcon = (type: string) => {
  switch (type) {
    case "cash":
      return Wallet;
    case "bank":
      return Building2;
    case "wallet":
      return CreditCard;
    default:
      return Wallet;
  }
};

const getAccountGradient = (type: string) => {
  switch (type) {
    case "cash":
      return "from-emerald-500/20 to-emerald-600/10";
    case "bank":
      return "from-blue-500/20 to-blue-600/10";
    case "wallet":
      return "from-violet-500/20 to-violet-600/10";
    default:
      return "from-slate-500/20 to-slate-600/10";
  }
};

export function AccountCard({ account }: AccountCardProps) {
  const openTransfer = useUIStore((state) => state.openTransfer);
  const [isEditOpen, setIsEditOpen] = useState(false);

  /* eslint-disable-next-line react/no-unstable-nested-components */
  const Icon = getAccountIcon(account.type);
  const gradient = getAccountGradient(account.type);

  return (
    <>
      <Card
        className={cn(
          "bg-linear-to-br hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border-border/50",
          gradient,
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: `${account.color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: account.color }} />
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditOpen(true)}
              className="h-9 w-9 rounded-xl hover:bg-white/10"
              title="Edit Account"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={openTransfer}
              className="h-9 w-9 rounded-xl hover:bg-white/10"
              title="Transfer"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground mb-1">{account.name}</p>
          <p
            className={cn(
              "text-2xl font-bold",
              account.balance >= 0 ? "text-foreground" : "text-rose-400",
            )}
          >
            {formatCurrency(account.balance)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span className="capitalize">{account.type} Account</span>
          </div>
        </CardContent>
      </Card>

      <EditAccountDialog
        account={account}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
