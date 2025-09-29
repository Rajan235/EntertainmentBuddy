"use client";

import { motion } from "framer-motion";
import {
  Search,
  PlusCircle,
  Clapperboard,
  Tv,
  Gamepad2,
  Book,
  Sparkles,
} from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { MediaCarousel } from "@/components/dashboard/MediaCarousel";
import { Category } from "@/types/tracking.types";

export default function DashboardPage() {
  const {
    inProgressEntries,
    plannedEntries,
    completedCount,
    isLoading,
    inProgressByCategory,
    plannedByCategory,
  } = useTracking();

  const inProgressCount = inProgressEntries.length;
  const planningCount = plannedEntries.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      <DashboardHeader />

      <StatsCards
        inProgressCount={inProgressCount}
        planningCount={planningCount}
        completedCount={completedCount}
        isLoading={isLoading}
      />

      <div className="space-y-12">
        {/* Dynamically render carousels for each category that has items in progress */}
        {Object.values(Category).map((category) => {
          const entries = inProgressByCategory[category] || [];
          // Don't render a section if there are no items and it's not loading
          if (entries.length === 0 && !isLoading) {
            return null;
          }

          const getCategoryIcon = (cat: Category) => {
            switch (cat) {
              case Category.MOVIE:
                return (
                  <Clapperboard className="w-12 h-12 text-muted-foreground mb-4" />
                );
              case Category.SERIES:
                return <Tv className="w-12 h-12 text-muted-foreground mb-4" />;
              case Category.ANIME:
                return (
                  <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                );
              case Category.GAME:
                return (
                  <Gamepad2 className="w-12 h-12 text-muted-foreground mb-4" />
                );
              case Category.BOOK:
                return (
                  <Book className="w-12 h-12 text-muted-foreground mb-4" />
                );
              default:
                return (
                  <Search className="w-12 h-12 text-muted-foreground mb-4" />
                );
            }
          };

          return (
            <MediaCarousel
              key={category}
              title={`${category} In Progress`}
              entries={entries}
              isLoading={isLoading}
              emptyState={{
                icon: getCategoryIcon(category),
                title: `No ${category.toLowerCase()} in progress`,
                message: `Start tracking a ${category.toLowerCase()} to see it here.`,
              }}
            />
          );
        })}
      </div>

      <div className="space-y-12">
        {Object.values(Category).map((category) => {
          const entries = plannedByCategory[category] || [];
          if (entries.length === 0 && !isLoading) {
            return null;
          }

          const getCategoryIcon = (cat: Category) => {
            switch (cat) {
              case Category.MOVIE:
                return (
                  <Clapperboard className="w-12 h-12 text-muted-foreground mb-4" />
                );
              case Category.SERIES:
                return <Tv className="w-12 h-12 text-muted-foreground mb-4" />;
              case Category.ANIME:
                return (
                  <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                );
              case Category.GAME:
                return (
                  <Gamepad2 className="w-12 h-12 text-muted-foreground mb-4" />
                );
              case Category.BOOK:
                return (
                  <Book className="w-12 h-12 text-muted-foreground mb-4" />
                );
              default:
                return (
                  <PlusCircle className="w-12 h-12 text-muted-foreground mb-4" />
                );
            }
          };

          return (
            <MediaCarousel
              key={`${category}-planning`}
              title={`Planning to Watch ${category}`}
              entries={entries}
              isLoading={isLoading}
              emptyState={{
                icon: getCategoryIcon(category),
                title: `No ${category.toLowerCase()} planned`,
                message: `Add a ${category.toLowerCase()} to your watchlist to see it here.`,
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
