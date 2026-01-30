import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Plus,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useAccountStore, useUIStore } from "@/stores";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/accounts", label: "Accounts", icon: Wallet },
  { path: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { path: "/analytics", label: "Analytics", icon: PieChart },
];

export function Sidebar() {
  const location = useLocation();
  const openAddTransaction = useUIStore((state) => state.openAddTransaction);
  const { accounts } = useAccountStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b border-white/5 bg-background/60 backdrop-blur-xl z-40 flex items-center justify-between px-4 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent-purple flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-accent-purple">
            MoneyFlow
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="h-9 w-9 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-64 p-0">
          <SheetHeader className="p-6 text-left">
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent-purple flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-accent-purple">
                MoneyFlow
              </span>
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full px-4 pb-4">
            <div className="space-y-2 mt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Button
                    key={item.path}
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 rounded-xl h-12",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link to={item.path}>
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>

            <div className="mt-auto pt-4 border-t border-border/10">
              <Card className="bg-white/5 border-white/5 p-4 rounded-xl backdrop-blur-none bg-none shadow-none">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Balance
                </p>
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(totalBalance)}
                </p>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <Card className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col rounded-none border-r border-border/10 bg-background/60 backdrop-blur-xl z-30">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:scale-105">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/70">
            MoneyFlow
          </span>
        </div>

        <Separator className="bg-border/10 mb-2" />

        {/* Navigation - Using NavigationMenu purely for structure as requested, though vertical is unconventional */}
        <div className="flex-1 px-4 py-4">
          <NavigationMenu className="max-w-full flex-col items-start space-y-1 block">
            <NavigationMenuList className="flex-col space-x-0 space-y-1 w-full block">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavigationMenuItem key={item.path} className="w-full">
                    <Link to={item.path} className="w-full block">
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 rounded-xl h-11 transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary hover:bg-primary/15 shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Add Transaction Button */}
        <div className="p-4">
          <Button
            onClick={() => openAddTransaction()}
            className="w-full h-12 rounded-xl bg-linear-to-r from-primary to-indigo-600 hover:opacity-90 transition-all shadow-lg shadow-primary/25"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Transaction
          </Button>
        </div>

        <Separator className="bg-border/10 mt-auto" />

        {/* Footer */}
        <div className="p-4">
          <Card className="bg-white/5 border-white/5 p-4 rounded-xl backdrop-blur-none bg-none shadow-none">
            <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
            <p className="text-lg font-bold text-white">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(totalBalance)}
            </p>
          </Card>
        </div>
      </Card>
    </>
  );
}
