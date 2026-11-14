"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, PlusCircle, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "../ui/button"; // Adjust path if needed

export default function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "My Polls", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Poll", href: "/dashboard/polls/new", icon: PlusCircle },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
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
  );
}