import { useState, useEffect, useMemo } from "react";
import {
  type TrackingEntry, // Import from the canonical types file
  Category, // Import from the canonical types file
  ProgressStatus, // Import from the canonical types file
} from "@/types/tracking.types"; // Correct import path

const mockAllEntries: TrackingEntry[] = [
  {
    id: "1",
    title: "Shōgun",
    category: Category.SERIES,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl: "/mock/shogun.jpg",
    progress: 8, // Episodes watched
    totalEpisodes: 10, // Total episodes
    rating: 9.2,
  },
  {
    id: "2",
    title: "Dune: Part Two",
    category: Category.MOVIE,
    status: ProgressStatus.IN_PROGRESS, // Changed to IN_PROGRESS for example
    posterUrl: "/mock/dune2.jpg",
    rating: 9.0,
  },
  {
    id: "3",
    title: "Helldivers 2",
    category: Category.GAME,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl: "/mock/helldivers2.jpg",
    hoursPlayed: 120,
    rating: 8.5,
  },
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
  {
    id: "6",
    title: "The Witcher 3: Wild Hunt",
    category: Category.GAME,
    status: ProgressStatus.COMPLETED,
    posterUrl: "/mock/witcher3.jpg",
    hoursPlayed: 200,
    rating: 9.5,
  },
  {
    id: "7",
    title: "Oppenheimer",
    category: Category.MOVIE,
    status: ProgressStatus.COMPLETED,
    posterUrl: "/mock/oppenheimer.jpg",
    rating: 8.8,
  },
  {
    id: "8",
    title: "Solo Leveling",
    category: Category.ANIME,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl: "/mock/sololeveling.jpg",
    progress: 7,
    totalEpisodes: 12,
    rating: 8.7,
  },
  {
    id: "9",
    title: "Project Hail Mary",
    category: Category.BOOK,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl: "/mock/projecthailmary.jpg",
    rating: 9.1,
  },
];

export function useTracking() {
  const [inProgressEntries, setInProgressEntries] = useState<TrackingEntry[]>(
    []
  ); // Renamed for clarity
  const [plannedEntries, setPlannedEntries] = useState<TrackingEntry[]>([]);
  const [completedEntries, setCompletedEntries] = useState<TrackingEntry[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      // Simulate API call delay
      setTimeout(() => {
        const inProgress = mockAllEntries.filter(
          (e) => e.status === ProgressStatus.IN_PROGRESS
        );
        const planning = mockAllEntries.filter(
          (e) => e.status === ProgressStatus.PLANNING
        );
        const completed = mockAllEntries.filter(
          (e) => e.status === ProgressStatus.COMPLETED
        );

        setInProgressEntries(inProgress);
        setPlannedEntries(planning);
        setCompletedEntries(completed);
        setCompletedCount(completed.length); // Count directly from filtered list
        setIsLoading(false);
      }, 1500); // 1.5 second delay
    };
    fetchData();
  }, []);

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
  };
}
