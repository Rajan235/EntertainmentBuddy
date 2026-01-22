import redisClient from "../config/redisClient";
import { AggregatedMediaDetail, MediaType, SearchResult } from "../types/media";
import * as tmdbClient from "../clients/tmdbClient";
import * as animeClient from "../clients/animeClient";
import * as bookClient from "../clients/bookClient";
import * as musicClient from "../clients/musicClient";
import * as igdbClient from "../clients/igdbClient";
import { MediaNotFoundError, ExternalApiError } from "../errors/error";

const CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 Hours
const SEARCH_CACHE_TTL = 60 * 10; // 10 Minutes for search results

const getCacheKey = (mediaType: MediaType, id: string): string =>
  `media:${mediaType}:${id}`;

/**
 * 1. FETCH DETAILS
 * Gets detailed info for a single item (cached).
 */
export async function getAggregatedDetails(
  mediaType: MediaType,
  id: string,
): Promise<AggregatedMediaDetail> {
  const key = getCacheKey(mediaType, id);

  // A. Check Cache
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData) as AggregatedMediaDetail;
    }
  } catch (err) {
    console.warn("⚠️ Redis Read Error (Proceeding to API):", err);
  }

  // B. Fetch from API
  let details: AggregatedMediaDetail;

  try {
    switch (mediaType) {
      case "MOVIE":
        details = await tmdbClient.fetchMovieDetails(id);
        break;
      case "SERIES":
        details = await tmdbClient.fetchSeriesDetails(id);
        break;
      case "ANIME":
        details = await animeClient.fetchAnimeDetails(id);
        break;
      case "BOOK":
        details = await bookClient.fetchBookDetails(id);
        break;
      case "MUSIC":
        // Fix: We use Spotify UUIDs now, so no need to split by "||"
        details = await musicClient.fetchMusicDetails(id);
        break;
      case "GAME":
        details = await igdbClient.fetchGameDetails(id);
        break;
      default:
        throw new Error(`Unsupported media type: ${mediaType}`);
    }
  } catch (error: any) {
    // Convert generic client errors to our specific Domain Error
    // This allows the Controller to return 404 instead of 500
    if (error.message.includes("not found")) {
      throw new MediaNotFoundError(`${mediaType} with ID ${id} not found.`);
    }
    throw new ExternalApiError(mediaType, error);
  }

  // C. Save to Cache
  try {
    await redisClient.setEx(key, CACHE_TTL_SECONDS, JSON.stringify(details));
  } catch (err) {
    console.warn("⚠️ Redis Write Error:", err);
  }

  return details;
}

/**
 * 2. CATEGORY SEARCH
 * Searches a specific category.
 */
export async function searchMedia(
  mediaType: MediaType,
  query: string,
): Promise<SearchResult[]> {
  try {
    switch (mediaType) {
      case "MOVIE":
        return await tmdbClient.searchMovies(query);
      case "SERIES":
        return await tmdbClient.searchSeries(query);
      case "ANIME":
        return await animeClient.searchAnime(query);
      case "BOOK":
        return await bookClient.searchBooks(query);
      case "MUSIC":
        return await musicClient.searchTracks(query);
      case "GAME":
        return await igdbClient.searchGames(query);
      default:
        return [];
    }
  } catch (error) {
    console.error(`❌ Search failed for ${mediaType}:`, error);
    return []; // Return empty array on failure so we don't crash the UI
  }
}

/**
 * 3. UNIFIED SEARCH (The "Empire" Feature)
 * Searches ALL categories in parallel.
 * Tolerates failures (if Music API fails, Movies still show up).
 */
export async function searchAllCategories(
  query: string,
): Promise<SearchResult[]> {
  const cacheKey = `search:all:${query.trim().toLowerCase()}`;

  // Check Cache for common searches
  try {
    const cachedSearch = await redisClient.get(cacheKey);
    if (cachedSearch) return JSON.parse(cachedSearch);
  } catch (err) {
    /* Ignore cache error */
  }

  // Execute all clients in Parallel
  // Promise.allSettled is crucial here: It waits for all to finish, regardless of success or failure.
  const results = await Promise.allSettled([
    tmdbClient.searchMovies(query),
    tmdbClient.searchSeries(query),
    igdbClient.searchGames(query),
    animeClient.searchAnime(query),
    bookClient.searchBooks(query),
    // Optional: searchMusic can be noisy in global search, you might exclude it or limit it
    musicClient.searchTracks(query),
  ]);

  // Merge Results
  const allResults: SearchResult[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allResults.push(...result.value);
    } else {
      console.error("⚠️ One search client failed:", result.reason);
    }
  });

  // Sort by relevance? Or just shuffle?
  // Usually, keeping them mixed or categorized by UI is better.
  // For raw API, we return the flat list.

  // Cache the combined result
  try {
    await redisClient.setEx(
      cacheKey,
      SEARCH_CACHE_TTL,
      JSON.stringify(allResults),
    );
  } catch (err) {
    /* Ignore */
  }

  return allResults;
}
