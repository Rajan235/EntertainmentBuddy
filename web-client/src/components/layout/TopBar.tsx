"use client";

import { useState } from "react";
import { Search, Bell, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export function TopBar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <button className="lg:hidden">
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden md:block flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search movies, series, games..."
              className="pl-10 bg-background"
            />
          </div>
        </div>

        <button
          className="md:hidden"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-card-hover rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>

        <button className="flex items-center gap-2 p-2 hover:bg-card-hover rounded-lg transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <motion.div
          className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border p-4 z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Input placeholder="Search..." autoFocus />
        </motion.div>
      )}
    </header>
  );
}
