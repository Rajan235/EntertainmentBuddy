import { motion } from "framer-motion";
import MediaCard from "@/components/ui/MediaCard";
import { MediaCardSkeleton } from "@/components/ui/SkeletonLoader";
import { TrackingEntry } from "@/types/tracking.types";

interface MediaGridViewProps {
  entries: TrackingEntry[];
  isLoading: boolean;
}

export function MediaGridView({ entries, isLoading }: MediaGridViewProps) {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {isLoading
        ? Array.from({ length: 12 }).map((_, i) => (
            <MediaCardSkeleton key={`skeleton-${i}`} />
          ))
        : entries.map((entry) => <MediaCard key={entry.id} {...entry} />)}
    </motion.div>
  );
}
