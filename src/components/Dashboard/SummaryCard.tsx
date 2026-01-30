import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  type: "income" | "expense" | "balance";
  trend?: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const config = {
  income: {
    icon: TrendingUp,
    gradient: "from-emerald-500/20 to-emerald-600/10",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    textColor: "text-emerald-500 dark:text-emerald-400",
    glow: "hover:shadow-emerald-500/20",
  },
  expense: {
    icon: TrendingDown,
    gradient: "from-rose-500/20 to-rose-600/10",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    textColor: "text-rose-500 dark:text-rose-400",
    glow: "hover:shadow-rose-500/20",
  },
  balance: {
    icon: Wallet,
    gradient: "from-violet-500/20 to-violet-600/10",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
    textColor: "text-foreground",
    glow: "hover:shadow-violet-500/20",
  },
};

export function SummaryCard({ title, amount, type, trend }: SummaryCardProps) {
  const {
    icon: Icon,
    gradient,
    iconBg,
    iconColor,
    textColor,
    glow,
  } = config[type];

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        `bg-linear-to-br ${gradient}`,
        glow,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-xl", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className={cn("text-2xl font-bold", textColor)}>
            {formatCurrency(amount)}
          </div>
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                trend >= 0
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400",
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
