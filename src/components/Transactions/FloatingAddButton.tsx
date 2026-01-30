import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores";

export function FloatingAddButton() {
  const openAddTransaction = useUIStore((state) => state.openAddTransaction);

  return (
    <Button
      onClick={() => openAddTransaction()}
      size="lg"
      className="lg:hidden fixed bottom-6 right-6 h-14 w-14 rounded-2xl shadow-xl animated-gradient hover:opacity-90 transition-opacity z-50"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
