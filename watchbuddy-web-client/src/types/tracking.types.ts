/**
 * Enum for the different categories of media that can be tracked.
 */
export enum Category {
  // Key = Value (Must match Backend Enums)
  MOVIE = "MOVIE",
  SERIES = "SERIES",
  ANIME = "ANIME",
  GAME = "GAME",
  BOOK = "BOOK",
  MUSIC = "MUSIC", // Don't forget Music!
}

/**
 * Enum for the different progress statuses of a tracked media item.
 */
export enum ProgressStatus {
  PLANNING = "PLANNING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED",
  ON_HOLD = "ON_HOLD",
}

/**
 * Represents a single media item being tracked by a user.
 */
export interface TrackingEntry {
  id: string;
  title: string;
  category: Category;
  status: ProgressStatus;
  posterUrl?: string;
  rating?: number;

  // Fields specific to series/anime
  progress?: number; // e.g., episodes watched
  totalEpisodes?: number;

  // Fields specific to games
  hoursPlayed?: number;
  // 👇 ADD THESE TWO FIELDS
  genres: string[]; // e.g. ["Action", "Sci-Fi"]
  // Timestamps
  addedAt?: string;
  updatedAt?: string;
}
