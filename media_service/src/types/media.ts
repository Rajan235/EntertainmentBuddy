// src/types/media.ts

export type MediaType =
  | "MOVIE"
  | "SERIES"
  | "GAME"
  | "ANIME"
  | "BOOK"
  | "MUSIC";

export interface AggregatedMediaDetail {
  internalId?: string; // Optional if you integrate a persistent DB later
  externalId: string;
  mediaType: MediaType;
  title: string;
  description: string;
  releaseDate: string; // ISO 8601 string
  posterUrl: string;
  trailerUrl?: string | null;
  runtime?: number; // Minutes or seconds depending on type
  status: string; // e.g., 'Released', 'Airing', 'Completed'
  genres: string[];
  rating?: number; // <--- ADDED THIS
}

export interface SearchResult {
  externalId: string;
  mediaType: MediaType;
  title: string;
  posterUrl: string;
  year: number;
  status?: string; // Helpful for UI
}
