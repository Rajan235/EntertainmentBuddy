import { Category, ProgressStatus } from "./tracking.types";

export interface MediaDetails {
  id: string;
  title: string;
  category: Category;
  posterUrl?: string;
  backdropUrl?: string;

  // Metadata
  description: string;
  releaseDate: string;
  status: string; // "Released", "Ended", "In Production" (API Status)

  // Arrays
  genres: string[];
  creators: string[];
  cast: string[];

  // Stats
  totalRatings: number; // Global average count
  rating?: number; // Global Average Score (e.g. 8.5)
  totalEpisodes?: number; // or Runtime in minutes

  // OPTIONAL User Context (Merged only if the user is tracking it)
  userStatus?: ProgressStatus; // Renamed to avoid collision!
  userProgress?: number;
  userRating?: number;
  platforms?: string[];
}
