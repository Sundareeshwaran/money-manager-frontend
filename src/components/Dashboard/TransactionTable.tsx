import { format } from "date-fns";
import { Edit2, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUIStore } from "@/stores";
import type { Transaction } from "@/types";

interface TransactionTableProps {
  transactions: Transaction[];
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export function TransactionTable({
  transactions,
  showActions = true,
  onDelete,
}: TransactionTableProps) {
  const { openAddTransaction, setEditingTransaction } = useUIStore();

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    openAddTransaction(transaction.type);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
          <ArrowUpRight className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No transactions yet</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Add your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-white/5 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="hover:bg-white/5 border-white/5">
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="hidden md:table-cell">Account</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            {showActions && (
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";
            const isEditable = transaction.isEditable !== false;

            return (
              <TableRow
                key={transaction._id}
                className="group hover:bg-white/5 border-white/5"
              >
                <TableCell>
                  <div
                    className={`
                      p-2 rounded-lg w-9 h-9 flex items-center justify-center
                      ${isIncome ? "bg-emerald-500/20" : "bg-rose-500/20"}
                    `}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-rose-400" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {transaction.description || "Transaction"}
                  <div className="md:hidden text-xs text-muted-foreground mt-1">
                    {format(new Date(transaction.date), "MMM dd")} •{" "}
                    {transaction.account?.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal"
                    style={{
                      backgroundColor: `${transaction.category?.color}20`,
                      color: transaction.category?.color,
                    }}
                  >
                    {transaction.category?.name}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {transaction.account?.name}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`font-semibold ${
                      isIncome ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10"
                        onClick={() => handleEdit(transaction)}
                        disabled={!isEditable}
                        title={
                          isEditable ? "Edit" : "Cannot edit after 12 hours"
                        }
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-rose-500/20 hover:text-rose-400"
                        onClick={() => onDelete?.(transaction._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
