"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/AuthContext";

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-bold mb-2">
        Welcome back,{" "}
        <span className="text-gradient">{user?.username || "User"}</span>
      </h1>
      <p className="text-muted-foreground text-lg">
        Continue tracking your entertainment journey
      </p>
    </motion.div>
  );
}
