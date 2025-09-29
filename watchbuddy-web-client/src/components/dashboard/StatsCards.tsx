"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  inProgressCount: number;
  planningCount: number;
  completedCount: number;
  isLoading: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StatsCards({
  inProgressCount,
  planningCount,
  completedCount,
  isLoading,
}: StatsCardsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="glass rounded-xl p-6 border border-primary/20"
        variants={item}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mb-1">In Progress</p>
            <p className="text-3xl font-bold text-primary">
              {isLoading ? "..." : inProgressCount}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-primary/50" />
        </div>
      </motion.div>

      <motion.div
        className="glass rounded-xl p-6 border border-accent/20"
        variants={item}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mb-1">Planning</p>
            <p className="text-3xl font-bold text-accent-foreground">
              {isLoading ? "..." : planningCount}
            </p>
          </div>
          <Clock className="w-8 h-8 text-accent/50" />
        </div>
      </motion.div>

      <motion.div
        className="glass rounded-xl p-6 border border-green-500/20"
        variants={item}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-500">
              {isLoading ? "..." : completedCount}
            </p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-500/50" />
        </div>
      </motion.div>
    </motion.div>
  );
}
