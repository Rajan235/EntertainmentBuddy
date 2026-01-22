import { GraphQLClient, gql } from "graphql-request";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const ANILIST_API_URL = "https://graphql.anilist.co";

// --- 1. Strict Typing (Safety First) ---

interface AniListMediaRaw {
  id: number;
  idMal?: number;
  title: {
    english?: string;
    romaji?: string;
  };
  coverImage: {
    extraLarge: string;
  };
  startDate: {
    year?: number;
    month?: number;
    day?: number;
  };
  status: string;
  description?: string;
  trailer?: {
    id: string;
    site: string;
  };
  episodes?: number;
  duration?: number;
  genres?: string[];
  averageScore?: number;
}

// Responses from AniList always follow this structure
interface SearchResponse {
  Page: {
    media: AniListMediaRaw[];
  };
}

interface DetailResponse {
  Media: AniListMediaRaw;
}

// --- 2. The Client Setup ---
// We instantiate it once to reuse the configuration
const client = new GraphQLClient(ANILIST_API_URL, {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
// --- 3. Optimized Queries ---

const SEARCH_QUERY = gql`
  query ($search: String) {
    Page(page: 1, perPage: 10) {
      media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
        id
        idMal
        title {
          english
          romaji
        }
        coverImage {
          extraLarge
        }
        startDate {
          year
        }
        status
      }
    }
  }
`;

const DETAILS_QUERY = gql`
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      idMal
      title {
        english
        romaji
      }
      description(asHtml: false)
      startDate {
        year
        month
        day
      }
      coverImage {
        extraLarge
      }
      trailer {
        id
        site
      }
      episodes
      duration
      status
      genres
      averageScore
    }
  }
`;
// --- 4. Service Functions ---

export async function searchAnime(query: string): Promise<SearchResult[]> {
  // Input Sanitization: Don't waste API calls on empty strings
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    // Generics <SearchResponse> ensure TypeScript knows exactly what 'data' looks like
    const data = await client.request<SearchResponse>(SEARCH_QUERY, {
      search: cleanQuery,
    });

    // Defensive check: AniList *should* return media, but we never trust external APIs fully
    if (!data.Page?.media) return [];

    return data.Page.media.map((anime) => ({
      externalId: anime.id.toString(),
      mediaType: "ANIME",
      // Priority: English Title -> Romaji -> "Untitled" fallback
      title: anime.title.english || anime.title.romaji || "Untitled",
      posterUrl: anime.coverImage.extraLarge || "",
      year: anime.startDate.year || 0,
      status: anime.status,
    }));
  } catch (error) {
    // Log the specific GraphQL error message for debugging
    console.error("❌ AniList Search Failed:", error);
    return []; // Fail gracefully, don't crash the UI
  }
}

export async function fetchAnimeDetails(
  id: string,
): Promise<AggregatedMediaDetail> {
  // Validation: Ensure ID is actually a number before sending
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new Error(`Invalid Anime ID: ${id}`);
  }

  try {
    const data = await client.request<DetailResponse>(DETAILS_QUERY, {
      id: numericId,
    });

    const anime = data.Media;
    if (!anime) throw new Error("Anime not found");

    return {
      externalId: anime.id.toString(),
      mediaType: "ANIME",

      title: anime.title.english || anime.title.romaji || "Untitled",
      description: anime.description || "No description available.",

      // Date Formatting: "2023-01-05" (Pads single digits with 0)
      releaseDate: anime.startDate.year
        ? `${anime.startDate.year}-${String(anime.startDate.month || 1).padStart(2, "0")}-${String(anime.startDate.day || 1).padStart(2, "0")}`
        : "Unknown",

      posterUrl: anime.coverImage.extraLarge || "",

      // Trailer: Only support YouTube links (AniList sometimes gives Dailymotion etc.)
      trailerUrl:
        anime.trailer?.site === "youtube"
          ? `https://www.youtube.com/watch?v=${anime.trailer.id}`
          : null,

      // Runtime: Episodes * Duration (Fallback to 0 to prevent NaN)
      runtime: (anime.episodes || 0) * (anime.duration || 24),

      status: anime.status,
      genres: anime.genres || [],

      // Normalize Rating: Convert 100-scale to 10-scale
      rating: anime.averageScore ? anime.averageScore / 10 : 0,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch anime details for ID ${id}:`, error);
    throw error; // Rethrow so the Controller knows to return 404 or 500
  }
}
