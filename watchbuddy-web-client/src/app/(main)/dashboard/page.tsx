"use client";

import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  PlusCircle,
} from "lucide-react";
import MediaCard from "@/components/ui/MediaCard";
import { MediaCardSkeleton } from "@/components/ui/SkeletonLoader";
import { useTracking } from "@/hooks/useTracking";
import { Category, ProgressStatus } from "@/types/tracking.types";

import { Button } from "@/components/ui/button";
export default function DashboardPage() {
  const { recentEntries, plannedEntries, completedCount, isLoading } =
    useTracking();

  const inProgressCount = recentEntries.length;
  const planningCount = plannedEntries.length;

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      {/* Hero Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, <span className="text-gradient">User</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Continue tracking your entertainment journey
        </p>
      </motion.div>

      {/* Stats Cards */}
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

      {/* Recently Updated */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recently Updated</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <MediaCardSkeleton key={`recent-skeleton-${i}`} />
              ))
            : recentEntries.length > 0
            ? recentEntries
                .slice(0, 5)
                .map((entry) => <MediaCard key={entry.id} {...entry} />)
            : !isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center text-center p-8 bg-secondary rounded-lg">
                  <Search className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-1">
                    Nothing here yet!
                  </h3>
                  <p className="text-muted-foreground">
                    Search for a movie, series, or game to start tracking.
                  </p>
                </div>
              )}
        </div>
      </motion.section>

      {/* Planning Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Planning to Watch</h2>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <MediaCardSkeleton key={`planned-skeleton-${i}`} />
              ))
            : plannedEntries.length > 0
            ? plannedEntries
                .slice(0, 5)
                .map((entry) => <MediaCard key={entry.id} {...entry} />)
            : !isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center text-center p-8 bg-secondary rounded-lg">
                  <PlusCircle className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-1">
                    Your watchlist is empty
                  </h3>
                  <p className="text-muted-foreground">
                    Add some titles to your plan to watch list.
                  </p>
                </div>
              )}
        </div>
      </motion.section>
    </motion.div>
  );
}
