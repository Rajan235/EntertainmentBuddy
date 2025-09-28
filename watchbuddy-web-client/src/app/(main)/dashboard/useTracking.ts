import { useState, useEffect } from "react";
import {
  type TrackingEntry,
  Category,
  ProgressStatus,
} from "@/types/tracking.types";

const mockRecentEntries: TrackingEntry[] = [
  {
    id: "1",
    title: "Shōgun",
    category: Category.SERIES,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl: "/mock/shogun.jpg",
    progress: 8,
    totalEpisodes: 10,
    rating: 9.2,
  },
  {
    id: "2",
    title: "Dune: Part Two",
    category: Category.MOVIE,
    status: ProgressStatus.COMPLETED,
    posterUrl: "/mock/dune2.jpg",
    rating: 9.0,
  },
  {
    id: "3",
    title: "Helldivers 2",
    category: Category.GAME,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl: "/mock/helldivers2.jpg",
    rating: 8.5,
  },
];

const mockPlannedEntries: TrackingEntry[] = [
  {
    id: "4",
    title: "Fallout",
    category: Category.SERIES,
    status: ProgressStatus.PLANNING,
    posterUrl: "/mock/fallout.jpg",
  },
  {
    id: "5",
    title: "The Sympathizer",
    category: Category.SERIES,
    status: ProgressStatus.PLANNING,
    posterUrl: "/mock/sympathizer.jpg",
  },
];

const mockCompletedCount = 42;

export function useTracking() {
  const [recentEntries, setRecentEntries] = useState<TrackingEntry[]>([]);
  const [plannedEntries, setPlannedEntries] = useState<TrackingEntry[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      // Simulate API call delay
      setTimeout(() => {
        setRecentEntries(mockRecentEntries);
        setPlannedEntries(mockPlannedEntries);
        setCompletedCount(mockCompletedCount);
        setIsLoading(false);
      }, 1500); // 1.5 second delay
    };

    fetchData();
  }, []);

  return { recentEntries, plannedEntries, completedCount, isLoading };
}
