"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MediaCard from "@/components/ui/MediaCard";
import { MediaCardSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/tracking.types";
import { apiClient } from "@/lib/client/client";
import { MediaDetails } from "@/types/media.types";
import { TrackingForm } from "@/components/forms/TrackingForm";

// Helper type for the items we fetch
interface RecommendedItem extends MediaDetails {
  matchScore?: number; // Optional field for that "85% Match" badge
}

export default function RecommendationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "ALL">(
    "ALL",
  );
  const [isRefetching, setIsRefetching] = useState(false);

  // State for the "Quick Add" modal
  const [selectedMedia, setSelectedMedia] = useState<RecommendedItem | null>(
    null,
  );

  const categories = [
    { value: "ALL", label: "All" },
    { value: Category.MOVIE, label: "Movies" },
    { value: Category.SERIES, label: "Series" },
    { value: Category.ANIME, label: "Anime" },
    { value: Category.GAME, label: "Games" },
    { value: Category.BOOK, label: "Books" },
  ];

  // 1. Fetch Data from Backend
  const {
    data: recommendations = [],
    isLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["recommendations", selectedCategory],
    queryFn: async () => {
      // NOTE: Ensure your Node.js service has a /trending endpoint,
      // or reuse /search with a generic query if needed for now.
      return apiClient<RecommendedItem[]>(`/api/media/trending`, {
        params: { category: selectedCategory },
      });
    },
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const handleRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">For You</h1>
        </div>
        <p className="text-muted-foreground">
          Trending and personalized picks based on your taste.
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.value as Category | "ALL")}
            className="whitespace-nowrap"
          >
            {cat.label}
          </Button>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-sm text-muted-foreground">
          Showing {recommendations.length} results
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading || isRefetching}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      {/* Error State */}
      {isError && (
        <div className="text-center py-20 bg-destructive/10 rounded-xl mb-8">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
          <h3 className="font-semibold text-destructive">
            Could not load recommendations
          </h3>
          <p className="text-sm text-destructive/80">
            The recommendation engine is currently offline.
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading
            ? // Skeletons
              Array.from({ length: 10 }).map((_, i) => (
                <MediaCardSkeleton key={`skeleton-${i}`} />
              ))
            : // Real Data
              recommendations.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group"
                >
                  <MediaCard
                    id={item.id}
                    title={item.title}
                    category={item.category}
                    posterUrl={item.posterUrl}
                    rating={item.rating}
                    // Link to detail page
                  />

                  {/* Quick Add Button */}
                  <motion.div
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigating to detail page
                        setSelectedMedia(item);
                      }}
                      className="bg-primary/90 backdrop-blur-sm text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary transition-colors"
                      title="Quick Add to List"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </motion.div>

                  {/* Match Score (Simulated or Real) */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2 py-0.5 text-[10px] font-bold text-green-400 shadow-xl z-10">
                    {(item.matchScore || 85 + (i % 15)).toFixed(0)}% Match
                  </div>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      {/* Tracking Modal */}
      {selectedMedia && (
        <TrackingForm
          mediaId={selectedMedia.id}
          mediaTitle={selectedMedia.title}
          category={selectedMedia.category}
          posterUrl={selectedMedia.posterUrl}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}
