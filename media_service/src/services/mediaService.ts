// src/services/mediaService.ts

import redisClient from "../config/redisClient";
import { AggregatedMediaDetail, MediaType, SearchResult } from "../types/media";
import { fetchMovieDetails } from "../clients/tmdbClient";
import { fetchAnimeDetails } from "../clients/animeClient";
// ... import other fetch functions

// TTL for cached media data (e.g., 24 hours)
const CACHE_TTL_SECONDS = 60 * 60 * 24;

const getCacheKey = (mediaType: MediaType, id: string): string =>
  `media:${mediaType}:${id}`;

export async function getAggregatedDetails(
  mediaType: MediaType,
  id: string
): Promise<AggregatedMediaDetail> {
  const key = getCacheKey(mediaType, id);

  // 1. CHECK CACHE
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    return JSON.parse(cachedData) as AggregatedMediaDetail;
  }

  // 2. FETCH FROM EXTERNAL API (Cache Miss)
  let cleanAggregatedData: AggregatedMediaDetail;

  try {
    switch (mediaType) {
      case "MOVIE":
      case "SERIES":
        cleanAggregatedData = await fetchMovieDetails(id); // Use TMDB for both
        break;
      case "ANIME":
        cleanAggregatedData = await fetchAnimeDetails(id);
        break;
      // ... Add cases for GAME, BOOK, MUSIC
      default:
        throw new Error(`Unsupported media type: ${mediaType}`);
    }
  } catch (error) {
    console.error(`Failed to fetch ${mediaType} ${id}:`, error);
    throw new Error(`External media data not found or API error.`);
  }

  // 3. WRITE TO CACHE
  await redisClient.setEx(
    key,
    CACHE_TTL_SECONDS,
    JSON.stringify(cleanAggregatedData)
  );

  return cleanAggregatedData;
}

export async function searchMedia(query: string): Promise<SearchResult[]> {
  // Implement complex search logic here (e.g., search TMDB, Jikan, etc. and combine results)
  // Caching search results is also highly recommended!
  return []; // Placeholder
}
