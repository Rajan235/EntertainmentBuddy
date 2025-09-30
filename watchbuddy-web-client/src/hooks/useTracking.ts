import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  type TrackingEntry, // Import from the canonical types file
  Category, // Import from the canonical types file
  ProgressStatus, // Import from the canonical types file
} from "@/types/tracking.types"; // Correct import path
import { apiClient } from "@/lib/client/client";

export function useTracking() {
  const {
    data: allEntries = [],
    isLoading,
    isError,
    error,
  } = useQuery<TrackingEntry[], Error>({
    queryKey: ["trackingEntries"],
    queryFn: () => apiClient<TrackingEntry[]>("/api/tracking"),
  });

  const inProgressEntries = useMemo(
    () => allEntries.filter((e) => e.status === ProgressStatus.IN_PROGRESS),
    [allEntries]
  );

  const plannedEntries = useMemo(
    () => allEntries.filter((e) => e.status === ProgressStatus.PLANNING),
    [allEntries]
  );

  const completedEntries = useMemo(
    () => allEntries.filter((e) => e.status === ProgressStatus.COMPLETED),
    [allEntries]
  );

  const completedCount = useMemo(
    () => completedEntries.length,
    [completedEntries]
  );

  const inProgressByCategory = useMemo(() => {
    return inProgressEntries.reduce((acc, entry) => {
      return {
        ...acc,
        [entry.category]: [...(acc[entry.category] || []), entry],
      }; // Corrected: Moved return statement
    }, {} as Record<Category, TrackingEntry[]>);
  }, [inProgressEntries]);

  const plannedByCategory = useMemo(() => {
    return plannedEntries.reduce((acc, entry) => {
      return {
        ...acc,
        [entry.category]: [...(acc[entry.category] || []), entry],
      };
    }, {} as Record<Category, TrackingEntry[]>);
  }, [plannedEntries]);

  return {
    inProgressEntries, // Renamed from recentEntries for clarity
    plannedEntries,
    completedEntries,
    completedCount,
    isLoading,
    inProgressByCategory,
    plannedByCategory,
    allEntries,
  };
}
