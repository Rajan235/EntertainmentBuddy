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
import { Category, TrackingEntry } from "@/types/tracking.types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 1. Helper: Icon Logic (Defined once, used everywhere)
const getCategoryIcon = (category: Category) => {
  const props = { className: "w-12 h-12 text-muted-foreground mb-4" };

  switch (category) {
    case Category.MOVIE:
      return <Clapperboard {...props} />;
    case Category.SERIES:
      return <Tv {...props} />;
    case Category.ANIME:
      return <Sparkles {...props} />;
    case Category.GAME:
      return <Gamepad2 {...props} />;
    case Category.BOOK:
      return <Book {...props} />;
    // case Category.MUSIC: return <Music {...props} />; // If you added Music
    default:
      return <PlusCircle {...props} />;
  }
};

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
  const isDashboardEmpty =
    inProgressCount === 0 && planningCount === 0 && completedCount === 0;

  // return (
  //   <motion.div
  //     initial={{ opacity: 0 }}
  //     animate={{ opacity: 1 }}
  //     className="max-w-7xl mx-auto space-y-8 pb-12"
  //   >
  //     <DashboardHeader />

  //     <StatsCards
  //       inProgressCount={inProgressCount}
  //       planningCount={planningCount}
  //       completedCount={completedCount}
  //       isLoading={isLoading}
  //     />
  //     {/* 2. Zero State: Friendly prompt if dashboard is empty */}
  //     {!isLoading && isDashboardEmpty && (
  //       <div className="text-center py-20 rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/5">
  //         <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
  //         <h3 className="text-xl font-semibold mb-2">
  //           Your dashboard is empty
  //         </h3>
  //         <p className="text-muted-foreground mb-6 max-w-md mx-auto">
  //           It looks like you haven't tracked anything yet. Search for a movie,
  //           game, or book to get started!
  //         </p>
  //         <Link href="/search">
  //           <Button>Start Tracking</Button>
  //         </Link>
  //       </div>
  //     )}

  //     <div className="space-y-12">
  //       {/* Dynamically render carousels for each category that has items in progress */}
  //       {Object.values(Category).map((category) => {
  //         const entries = inProgressByCategory[category] || [];
  //         // Don't render a section if there are no items and it's not loading
  //         if (entries.length === 0 && !isLoading) {
  //           return null;
  //         }

  //         const getCategoryIcon = (cat: Category) => {
  //           switch (cat) {
  //             case Category.MOVIE:
  //               return (
  //                 <Clapperboard className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             case Category.SERIES:
  //               return <Tv className="w-12 h-12 text-muted-foreground mb-4" />;
  //             case Category.ANIME:
  //               return (
  //                 <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             case Category.GAME:
  //               return (
  //                 <Gamepad2 className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             case Category.BOOK:
  //               return (
  //                 <Book className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             default:
  //               return (
  //                 <Search className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //           }
  //         };

  //         return (
  //           <MediaCarousel
  //             key={category}
  //             title={`${category} In Progress`}
  //             entries={entries}
  //             isLoading={isLoading}
  //             emptyState={{
  //               icon: getCategoryIcon(category),
  //               title: `No ${category.toLowerCase()} in progress`,
  //               message: `Start tracking a ${category.toLowerCase()} to see it here.`,
  //             }}
  //           />
  //         );
  //       })}
  //     </div>

  //     <div className="space-y-12">
  //       {Object.values(Category).map((category) => {
  //         const entries = plannedByCategory[category] || [];
  //         if (entries.length === 0 && !isLoading) {
  //           return null;
  //         }

  //         const getCategoryIcon = (cat: Category) => {
  //           switch (cat) {
  //             case Category.MOVIE:
  //               return (
  //                 <Clapperboard className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             case Category.SERIES:
  //               return <Tv className="w-12 h-12 text-muted-foreground mb-4" />;
  //             case Category.ANIME:
  //               return (
  //                 <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             case Category.GAME:
  //               return (
  //                 <Gamepad2 className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             case Category.BOOK:
  //               return (
  //                 <Book className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //             default:
  //               return (
  //                 <PlusCircle className="w-12 h-12 text-muted-foreground mb-4" />
  //               );
  //           }
  //         };

  //         return (
  //           <MediaCarousel
  //             key={`${category}-planning`}
  //             title={`Planning to Watch ${category}`}
  //             entries={entries}
  //             isLoading={isLoading}
  //             emptyState={{
  //               icon: getCategoryIcon(category),
  //               title: `No ${category.toLowerCase()} planned`,
  //               message: `Add a ${category.toLowerCase()} to your watchlist to see it here.`,
  //             }}
  //           />
  //         );
  //       })}
  //     </div>
  //   </motion.div>
  // );
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 pb-12"
    >
      <DashboardHeader />

      <StatsCards
        inProgressCount={inProgressCount}
        planningCount={planningCount}
        completedCount={completedCount}
        isLoading={isLoading}
      />

      {/* 2. Zero State: Friendly prompt if dashboard is empty */}
      {!isLoading && isDashboardEmpty && (
        <div className="text-center py-20 rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/5">
          <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">
            Your dashboard is empty
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            It looks like you haven't tracked anything yet. Search for a movie,
            game, or book to get started!
          </p>
          <Link href="/search">
            <Button>Start Tracking</Button>
          </Link>
        </div>
      )}

      {/* 3. In Progress Section */}
      <div className="space-y-12">
        {Object.values(Category).map((category) => (
          <CategorySection
            key={`progress-${category}`}
            title={`${capitalize(category)} In Progress`}
            entries={inProgressByCategory[category] || []}
            category={category}
            isLoading={isLoading}
            emptyMessage={`Start tracking a ${category.toLowerCase()} to see it here.`}
          />
        ))}
      </div>

      {/* 4. Planning Section */}
      <div className="space-y-12">
        {Object.values(Category).map((category) => (
          <CategorySection
            key={`planning-${category}`}
            title={`Planning to Watch ${capitalize(category)}`}
            entries={plannedByCategory[category] || []}
            category={category}
            isLoading={isLoading}
            emptyMessage={`Add a ${category.toLowerCase()} to your watchlist.`}
          />
        ))}
      </div>
    </motion.div>
  );
}

// ------------------------------------------------------------------
// Sub-Component: CategorySection
// Handles the logic of "Should I render?" to keep the main component clean.
// ------------------------------------------------------------------

interface CategorySectionProps {
  title: string;
  entries: TrackingEntry[];
  category: Category;
  isLoading: boolean;
  emptyMessage: string;
}

function CategorySection({
  title,
  entries,
  category,
  isLoading,
  emptyMessage,
}: CategorySectionProps) {
  // Logic: Don't render empty sections unless loading (to show skeletons)
  if (entries.length === 0 && !isLoading) return null;

  return (
    <MediaCarousel
      title={title}
      entries={entries}
      isLoading={isLoading}
      emptyState={{
        icon: getCategoryIcon(category),
        title: `No ${category.toLowerCase()} items`,
        message: emptyMessage,
      }}
    />
  );
}
// Helper utility
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
