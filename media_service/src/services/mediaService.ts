// src/services/mediaService.ts

import redisClient from "../config/redisClient";
import { AggregatedMediaDetail, MediaType, SearchResult } from "../types/media";
import * as tmdbClient from "../clients/tmdbClient";
import * as animeClient from "../clients/animeClient";
import * as bookClient from "../clients/bookClient";
import * as musicClient from "../clients/musicClient";
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
        cleanAggregatedData = await tmdbClient.fetchMovieDetails(id);
        break;
      case "ANIME":
        cleanAggregatedData = await animeClient.fetchAnimeDetails(id);
        break;
      case "BOOK":
        cleanAggregatedData = await bookClient.fetchBookDetails(id);
        break;
      case "MUSIC":
        // Music often uses composite IDs; the client handles resolving the API call.
        const [track, artist] = id.split("||"); // Example key format
        cleanAggregatedData = await musicClient.fetchMusicDetails(
          track,
          artist
        );
        break;
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
  // Note: Search results should have a much shorter TTL (e.g., 5-30 mins)
  // Complex search logic involving parallel calls to multiple clients goes here.
  return [];
}
