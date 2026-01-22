import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";

// --- 1. Strong Types for IGDB ---

interface IGDBVideo {
  video_id: string;
}

interface IGDBCompany {
  company: {
    name: string;
  };
}

interface IGDBGameRaw {
  id: number;
  name: string;
  summary?: string;
  first_release_date?: number; // Unix timestamp
  cover?: {
    url: string;
  };
  genres?: { name: string }[];
  videos?: IGDBVideo[]; // Trailers
  aggregated_rating?: number; // Critic Rating
  involved_companies?: IGDBCompany[]; // Developers
}

interface TwitchToken {
  access_token: string;
  expires_at: number;
}

// --- 2. Robust Auth (Singleton Pattern) ---

let tokenCache: TwitchToken | null = null;
let tokenRefreshPromise: Promise<string> | null = null; // prevents race conditions

async function getTwitchAccessToken(): Promise<string> {
  // 1. If valid token exists, use it
  if (tokenCache && tokenCache.expires_at > Date.now()) {
    return tokenCache.access_token;
  }

  // 2. If a refresh is already happening, wait for it (Singleton)
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  // 3. Start a new refresh
  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    throw new Error("IGDB Client ID or Secret is not configured.");
  }

  tokenRefreshPromise = (async () => {
    try {
      const response = await axios.post(TWITCH_AUTH_URL, null, {
        params: {
          client_id: IGDB_CLIENT_ID,
          client_secret: IGDB_CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      });

      const { access_token, expires_in } = response.data;
      tokenCache = {
        access_token,
        // Buffer: Expire 5 minutes early to be safe
        expires_at: Date.now() + (expires_in - 300) * 1000,
      };
      return access_token;
    } catch (error) {
      console.error("❌ Twitch Auth Failed:", error);
      throw error;
    } finally {
      tokenRefreshPromise = null; // Reset promise so next time we can try again
    }
  })();

  return tokenRefreshPromise;
}

// --- 3. The Client ---

const igdbClient = axios.create({ baseURL: IGDB_BASE_URL });

igdbClient.interceptors.request.use(async (config) => {
  const accessToken = await getTwitchAccessToken();
  config.headers["Client-ID"] = IGDB_CLIENT_ID;
  config.headers["Authorization"] = `Bearer ${accessToken}`;
  config.headers["Accept"] = "application/json";
  return config;
});

// Helper: IGDB images often come as "//images.igdb.com...". We need "https://"
// Also resize to 1080p (t_cover_big is decent, t_1080p is better)
const getImageUrl = (url?: string): string => {
  if (!url) return "";
  const cleanUrl = url.startsWith("//") ? `https:${url}` : url;
  return cleanUrl.replace("t_thumb", "t_cover_big");
};

// --- 4. Service Functions ---

export async function searchGames(query: string): Promise<SearchResult[]> {
  // Sanitize: Escape quotes to prevent syntax errors
  const cleanQuery = query.replace(/"/g, '\\"').trim();
  if (!cleanQuery) return [];

  try {
    // We fetch Developer Name (involved_companies) to show as 'Status'
    const apiQuery = `
      search "${cleanQuery}"; 
      fields name, cover.url, first_release_date, involved_companies.company.name; 
      limit 10;
    `;

    const { data } = await igdbClient.post<IGDBGameRaw[]>("/games", apiQuery);

    if (!data) return [];

    return data.map((game) => ({
      externalId: game.id.toString(),
      mediaType: "GAME",
      title: game.name,
      posterUrl: getImageUrl(game.cover?.url),
      year: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : 0,
      // Show Developer name (e.g. "FromSoftware") or Fallback
      status: game.involved_companies?.[0]?.company?.name || "Unknown Dev",
    }));
  } catch (error) {
    console.error("❌ IGDB Search Error:", error);
    return [];
  }
}

export async function fetchGameDetails(
  id: string,
): Promise<AggregatedMediaDetail> {
  try {
    // Fetch Trailer (videos) and Rating (aggregated_rating) in ONE call
    const query = `
      fields name, summary, cover.url, first_release_date, genres.name, 
      aggregated_rating, videos.video_id, involved_companies.company.name; 
      where id = ${id};
    `;

    const { data } = await igdbClient.post<IGDBGameRaw[]>("/games", query);
    const game = data[0];

    if (!game) throw new Error(`Game not found: ${id}`);

    // Trailer Logic: Get the first YouTube video ID
    const youtubeId = game.videos?.[0]?.video_id;

    return {
      externalId: game.id.toString(),
      mediaType: "GAME",
      title: game.name,
      description: game.summary || "No description available.",

      releaseDate: game.first_release_date
        ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
        : "Unknown",

      posterUrl: getImageUrl(game.cover?.url),

      trailerUrl: youtubeId
        ? `https://www.youtube.com/watch?v=${youtubeId}`
        : null,

      runtime: 0, // Could be fetched from HLTB (HowLongToBeat) API if you add that later

      // Developer Name as status is more useful than just "Released"
      status: game.involved_companies?.[0]?.company?.name || "Released",

      genres: game.genres?.map((g) => g.name) || [],

      // Convert 100-scale to 10-scale
      rating: game.aggregated_rating
        ? Math.round(game.aggregated_rating) / 10
        : 0,
    };
  } catch (error) {
    console.error(`❌ IGDB Detail Error ${id}:`, error);
    throw new Error("Game not found");
  }
}
