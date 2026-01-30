import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardStore } from "@/stores";
import { Calendar } from "lucide-react";

export function PeriodSelector() {
  const { period, setPeriod } = useDashboardStore();

  return (
    <Select
      value={period}
      onValueChange={(v) => setPeriod(v as "weekly" | "monthly" | "yearly")}
    >
      <SelectTrigger className="w-[160px] bg-background/50 border-white/10 rounded-xl h-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <SelectValue placeholder="Select period" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="weekly" className="focus:bg-primary/20">
          Weekly
        </SelectItem>
        <SelectItem value="monthly" className="focus:bg-primary/20">
          Monthly
        </SelectItem>
        <SelectItem value="yearly" className="focus:bg-primary/20">
          Yearly
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
