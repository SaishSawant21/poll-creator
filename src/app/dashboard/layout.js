"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, PlusCircle, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  // Navigation items for the sidebar
  const navItems = [
    { name: "My Polls", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Poll", href: "/dashboard/polls/new", icon: PlusCircle },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* 1. Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card flex flex-col hidden md:flex">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <BarChart3 className="w-6 h-6" />
            <span>Pollify</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 ${isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : ""
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-border/50">
          <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-red-500 hover:text-red-600 hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
            Log out
          </Button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="font-semibold text-lg">Dashboard</h1>

          {/* User Avatar Placeholder */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome back</span>
            <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
              U
            </div>
          </div>
        </header>

        {/* Page Content (Rendered by the specific page) */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}