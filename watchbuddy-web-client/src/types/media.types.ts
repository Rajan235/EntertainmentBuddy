import { TrackingEntry } from "./tracking.types";

export interface MediaDetails extends TrackingEntry {
  description: string;
  releaseDate: string;
  backdropUrl?: string;
  genres: string[];
  totalRatings: number;
  creators: string[];
  cast: string[];
}
