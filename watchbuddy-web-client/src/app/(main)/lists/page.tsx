"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Search,
  Grid,
  List,
  Clapperboard,
  Tv,
  Gamepad2,
  LayoutGrid,
  Clock,
  CheckCircle,
  ListTodo,
} from "lucide-react";
import MediaCard from "@/components/ui/MediaCard";
import { MediaCardSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSidebar } from "@/components/layouts/FilterSidebar";
import { useTracking } from "@/hooks/useTracking";
import { Category, ProgressStatus } from "@/types/tracking.types";
import { cn } from "@/lib/utils";

type CategoryFilter = Category | "ALL";
type StatusFilter = ProgressStatus | "ALL";

export default function ListsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const { allEntries, isLoading } = useTracking();

  const filteredEntries = useMemo(() => {
    return allEntries.filter((entry) => {
      const categoryMatch =
        categoryFilter === "ALL" || entry.category === categoryFilter;
      const statusMatch =
        statusFilter === "ALL" || entry.status === statusFilter;
      return categoryMatch && statusMatch;
    });
  }, [allEntries, categoryFilter, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Lists</h1>
        <p className="text-muted-foreground">
          Manage your entertainment tracking
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input placeholder="Search your lists..." className="pl-10" />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <div className="flex bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bars */}
      <div className="space-y-3 mb-6">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton
            isActive={categoryFilter === "ALL"}
            onClick={() => setCategoryFilter("ALL")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> All
          </FilterButton>
          <FilterButton
            isActive={categoryFilter === Category.MOVIE}
            onClick={() => setCategoryFilter(Category.MOVIE)}
          >
            <Clapperboard className="w-4 h-4 mr-2" /> Movies
          </FilterButton>
          <FilterButton
            isActive={categoryFilter === Category.SERIES}
            onClick={() => setCategoryFilter(Category.SERIES)}
          >
            <Tv className="w-4 h-4 mr-2" /> Series
          </FilterButton>
          <FilterButton
            isActive={categoryFilter === Category.GAME}
            onClick={() => setCategoryFilter(Category.GAME)}
          >
            <Gamepad2 className="w-4 h-4 mr-2" /> Games
          </FilterButton>
        </div>
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <FilterButton isActive={statusFilter === "ALL"} onClick={() => setStatusFilter("ALL")}>
            All Status
          </FilterButton>
          <FilterButton isActive={statusFilter === ProgressStatus.IN_PROGRESS} onClick={() => setStatusFilter(ProgressStatus.IN_PROGRESS)}>
            <Clock className="w-4 h-4 mr-2" /> In Progress
          </FilterButton>
          <FilterButton isActive={statusFilter === ProgressStatus.PLANNING} onClick={() => setStatusFilter(ProgressStatus.PLANNING)}>
            <ListTodo className="w-4 h-4 mr-2" /> Planning
          </FilterButton>
          <FilterButton isActive={statusFilter === ProgressStatus.COMPLETED} onClick={() => setStatusFilter(ProgressStatus.COMPLETED)}>
            <CheckCircle className="w-4 h-4 mr-2" /> Completed
          </FilterButton>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {viewMode === "grid" ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <MediaCardSkeleton key={`skeleton-${i}`} />
                  ))
                : filteredEntries.map((entry) => (
                    <MediaCard key={entry.id} {...entry} />
                  ))}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* List view implementation */}
              <p className="text-muted-foreground">List view coming soon...</p>
            </div>
          )}

          {!isLoading && filteredEntries.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-secondary rounded-lg">
              <Filter className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-1">No Results Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-background/95 z-50 p-4 animate-in fade-in-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                Close
              </Button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterButton({
  isActive,
  children,
  ...props
}: { isActive: boolean; children: React.ReactNode } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={isActive ? "default" : "secondary"}
      size="sm"
      className={cn(
        "h-8 transition-all",
        isActive && "shadow-md shadow-primary/20"
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar />
        </div>

        {/* Content */}
        <div className="flex-1">
          {viewMode === "grid" ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <MediaCardSkeleton key={i} />
                  ))
                : Array.from({ length: 12 }).map((_, i) => (
                    <MediaCard
                      key={i}
                      id={`list-${i}`}
                      title={`Media Title ${i + 1}`}
                      category={Object.values(Category)[i % 5]}
                      status={Object.values(ProgressStatus)[i % 5]}
                      rating={3.5 + (i % 3)}
                      posterUrl=""
                      progress={i * 2}
                      totalEpisodes={24}
                    />
                  ))}
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* List view implementation */}
              <p className="text-muted-foreground">List view coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-background/95 z-50 p-6">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button variant="ghost" onClick={() => setShowFilters(false)}>
                Close
              </Button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </div>
  );
}
