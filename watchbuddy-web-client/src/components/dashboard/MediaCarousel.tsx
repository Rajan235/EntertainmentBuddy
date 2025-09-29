"use client";

import { motion } from "framer-motion";
import { Search, PlusCircle } from "lucide-react";
import MediaCard from "@/components/ui/MediaCard";
import { MediaCardSkeleton } from "@/components/ui/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { TrackingEntry } from "@/types/tracking.types";

interface MediaCarouselProps {
  title: string;
  entries: TrackingEntry[];
  isLoading: boolean;
  emptyState: {
    icon: React.ReactNode;
    title: string;
    message: string;
  };
}

export function MediaCarousel({
  title,
  entries,
  isLoading,
  emptyState,
}: MediaCarouselProps) {
  return (
    <motion.section
      className="mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div className="w-40 md:w-48 flex-shrink-0" key={`skeleton-${i}`}>
                <MediaCardSkeleton />
              </div>
            ))
          : entries.length > 0
          ? entries.map((entry) => <MediaCard key={entry.id} {...entry} />)
          : !isLoading && (
              <div className="col-span-full flex flex-col items-center justify-center text-center p-8 bg-secondary rounded-lg w-full">
                {emptyState.icon}
                <h3 className="text-xl font-semibold mb-1">
                  {emptyState.title}
                </h3>
                <p className="text-muted-foreground">{emptyState.message}</p>
              </div>
            )}
      </div>
    </motion.section>
  );
}
