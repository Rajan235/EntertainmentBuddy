"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { sidebarItems } from "./nav-data"; // Import shared data

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-secondary border-r border-border h-screen sticky top-0">
      <div className="p-6">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold text-gradient">WatchBuddy</h1>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
        <button className="flex items-center gap-3 w-full text-left px-4 py-2.5 mt-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
