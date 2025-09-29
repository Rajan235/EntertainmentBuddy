"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, User, Menu, X, Search } from "lucide-react";
import { sidebarItems } from "./nav-data"; // Import shared data
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/AuthContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-8 bg-background/80 backdrop-blur-sm border-b border-border">
      {/* Mobile Menu Button & Logo */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <Link href="/dashboard" className="md:hidden">
          <h1 className="text-xl font-bold text-gradient">W</h1>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 flex justify-center px-4 lg:px-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search movies, series, games..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 cursor-pointer p-1 rounded-md hover:bg-accent">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center cursor-pointer">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-secondary z-50 p-4 animate-in fade-in-20 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold text-gradient">WatchBuddy</h1>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="w-6 h-6 text-foreground" />
            </Button>
          </div>
          <nav className="flex flex-col space-y-3">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg text-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-6 h-6" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
