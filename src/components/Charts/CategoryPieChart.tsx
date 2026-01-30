import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategoryAnalytics } from "@/types";

interface CategoryPieChartProps {
  data: CategoryAnalytics[];
  title?: string;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: { name: string; value: number; percentage: number; color: string };
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-3xl border border-border/50 rounded-2xl p-4 shadow-xl shadow-black/10 min-w-45">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-3 h-3 rounded-full ring-2 ring-transparent"
            style={{ backgroundColor: data.color }}
          />
          <span className=" font-medium text-foreground">{data.name}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted-foreground font-medium">
            Amount
          </span>
          <span className="text-lg font-bold tabular-nums text-foreground">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(data.value)}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4 mt-1">
          <span className="text-xs text-muted-foreground">Share</span>
          <span className="text-sm font-semibold text-foreground">
            {data.percentage}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function CategoryPieChart({
  data,
  title = "Spending by Category",
}: CategoryPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.name,
    value: item.total,
    color: item.color,
    percentage: item.percentage,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  // Checks if data is effectively empty
  if (!data || data.length === 0 || total === 0) {
    return (
      <Card className="flex flex-col h-full border-border/50">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-muted-foreground min-h-75 gap-2">
          <div className="p-3 rounded-full bg-muted/50 ring-1 ring-border/50">
            <PieChart className="h-6 w-6 opacity-50" />
          </div>
          <p className="text-sm font-medium">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-6">
        <div className="h-65 relative w-full mt-4 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={115}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={5}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity"
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col pt-4">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1 opacity-80">
              Total
            </p>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
                notation: "compact",
              }).format(total)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 px-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {chartData.slice(0, 6).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 group cursor-default"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
