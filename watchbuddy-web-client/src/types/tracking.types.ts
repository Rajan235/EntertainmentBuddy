/**
 * Enum for the different categories of media that can be tracked.
 */
export enum Category {
  MOVIE = "Movie",
  SERIES = "Series",
  ANIME = "Anime",
  GAME = "Game",
  BOOK = "Book",
}

/**
 * Enum for the different progress statuses of a tracked media item.
 */
export enum ProgressStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  DROPPED = "Dropped",
  ON_HOLD = "On Hold",
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

  // Timestamps
  addedAt?: string;
  updatedAt?: string;
}
