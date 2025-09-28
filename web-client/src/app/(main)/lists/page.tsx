"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Search, Grid, List } from "lucide-react";
import MediaCard from "@/components/ui/MediaCard";
import { MediaCardSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FilterSidebar } from "@/components/layout/FilterSidebar";
import { useTracking } from "@/hooks/useTracking";
import { Category, ProgressStatus } from "@/types/tracking.types";

export default function ListsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const { entries, isLoading } = useTracking();

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
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
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

          <div className="flex bg-card/80 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
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
