import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PeriodData } from "@/types";

interface IncomeExpenseChartProps {
  data: PeriodData[];
  title?: string;
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}k`;
  }
  return `₹${value}`;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-3xl border border-border/50 rounded-2xl p-4 shadow-xl shadow-black/10">
        <p className="text-sm font-medium text-foreground mb-3">{label}</p>
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-8 min-w-40"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full ring-2 ring-transparent",
                    entry.name === "income" ? "bg-emerald-500" : "bg-rose-500",
                  )}
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {entry.name}
                </span>
              </div>
              <span className="font-semibold tabular-nums text-foreground">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function IncomeExpenseChart({
  data,
  title = "Income vs Expense",
}: IncomeExpenseChartProps) {
  // Safe default for empty data
  if (!data || data.length === 0) {
    return (
      <Card className="h-full border-border/50">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-2">
          <div className="p-3 rounded-full bg-muted/50 ring-1 ring-border/50">
            <BarChart3 className="h-6 w-6 opacity-50" />
          </div>
          <p className="text-sm font-medium">
            No data available for this period
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-0 pb-6 pr-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, left: 10, bottom: 5 }}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                dy={12}
                minTickGap={30}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                tickFormatter={formatCurrency}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "var(--color-muted)",
                  opacity: 0.2,
                  radius: 4,
                }}
              />
              <Bar
                dataKey="income"
                name="income"
                fill="var(--color-emerald-500)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
              <Bar
                dataKey="expense"
                name="expense"
                fill="var(--color-rose-500)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 opacity-90">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="text-sm font-medium text-foreground">Expense</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
