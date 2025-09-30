import { Category, ProgressStatus } from "@/types/tracking.types";
import { MediaDetails } from "@/types/media.types";
import { TrackingEntry } from "@/types/tracking.types";

export const mockAllEntries: TrackingEntry[] = [
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

const mockMediaDetailsData: Omit<MediaDetails, keyof TrackingEntry> = {
  description:
    "In 1600s Japan, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him, when a mysterious European ship is found marooned in a nearby fishing village.",
  releaseDate: "2024-02-27",
  backdropUrl: "/mock/shogun-backdrop.jpg",
  genres: ["Drama", "History", "War"],
  totalRatings: 15234,
  creators: ["Rachel Kondo", "Justin Marks"],
  cast: ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"],
};

/**
 * Finds a media item by its ID and merges it with detailed mock data.
 * In a real app, this would be a database or API call to get full details.
 * @param id The ID of the media to find.
 * @returns The full MediaDetails object or null if not found.
 */
export function getMediaDetailsById(id: string): MediaDetails | null {
  const trackingEntry = mockAllEntries.find((entry) => entry.id === id);

  if (!trackingEntry) {
    return null;
  }

  // For any entry, we merge it with the same detailed mock data.
  // A real implementation would fetch unique details for each ID.
  return {
    ...trackingEntry,
    ...mockMediaDetailsData,
    // Ensure the ID, title, etc., from the specific entry are preserved
    id: trackingEntry.id,
    title: trackingEntry.title,
    category: trackingEntry.category,
    posterUrl: trackingEntry.posterUrl,
    status: trackingEntry.status,
  };
}
