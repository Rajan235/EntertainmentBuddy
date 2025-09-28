export enum Category {
  MOVIE = "MOVIE",
  SERIES = "SERIES",
  GAME = "GAME",
}

export enum ProgressStatus {
  IN_PROGRESS = "IN_PROGRESS",
  PLANNING = "PLANNING",
  COMPLETED = "COMPLETED",
}

export interface TrackingEntry {
  id: string;
  title: string;
  category: Category;
  status: ProgressStatus;
  posterUrl: string;
  rating?: number;
  progress?: number;
  totalEpisodes?: number;
}
