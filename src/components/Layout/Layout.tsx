import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { AddTransactionModal } from "@/components/Transactions";
import { TransferModal } from "@/components/Accounts";
import { FloatingAddButton } from "@/components/Transactions";

export function Layout() {
  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Floating Add Button (Mobile) */}
      <FloatingAddButton />

      {/* Global Modals */}
      <AddTransactionModal />
      <TransferModal />
    </div>
  );
}
