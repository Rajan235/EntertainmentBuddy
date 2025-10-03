// src/clients/igdbClient.ts

import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const IGDB_BASE_URL = "https://api.igdb.com/v4";
const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";

interface TwitchToken {
  access_token: string;
  expires_at: number;
}

// In-memory cache for the Twitch access token
let tokenCache: TwitchToken | null = null;

/**
 * Fetches a new Twitch access token if the cached one is expired or missing.
 */
async function getTwitchAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expires_at > Date.now()) {
    return tokenCache.access_token;
  }

  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    throw new Error("IGDB Client ID or Secret is not configured.");
  }

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
    // Set expiry to 1 minute before it actually expires, as a buffer
    expires_at: Date.now() + (expires_in - 60) * 1000,
  };

  return tokenCache.access_token;
}

const igdbClient = axios.create({ baseURL: IGDB_BASE_URL });

// Axios interceptor to automatically add auth headers to every IGDB request
igdbClient.interceptors.request.use(async (config) => {
  const accessToken = await getTwitchAccessToken();
  config.headers["Client-ID"] = IGDB_CLIENT_ID;
  config.headers["Authorization"] = `Bearer ${accessToken}`;
  return config;
});

/**
 * Converts an IGDB image URL to a higher resolution version.
 */
const getImageUrl = (url?: string, size = "cover_big"): string => {
  if (!url) return "";
  return `https:${url.replace("t_thumb", `t_${size}`)}`;
};

export async function fetchGameDetails(
  id: string
): Promise<AggregatedMediaDetail> {
  const query = `fields name, summary, cover.url, first_release_date, genres.name, status; where id = ${id};`;
  const { data } = await igdbClient.post("/games", query);
  const game = data[0];

  if (!game) {
    throw new Error(`Game with ID ${id} not found.`);
  }

  return {
    externalId: game.id.toString(),
    mediaType: "GAME",
    title: game.name,
    description: game.summary,
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString()
      : "Unknown Date",
    posterUrl: getImageUrl(game.cover?.url),
    trailerUrl: undefined, // Requires separate API call
    runtime: undefined, // Not applicable for games
    status: "Released", // Simplified status
    genres: game.genres?.map((g: any) => g.name) || [],
  };
}

export async function searchGames(query: string): Promise<SearchResult[]> {
  const apiQuery = `search "${query}"; fields name, cover.url, first_release_date; limit 10;`;
  const { data } = await igdbClient.post("/games", apiQuery);

  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map(
    (game: any): SearchResult => ({
      externalId: game.id.toString(),
      mediaType: "GAME",
      title: game.name,
      posterUrl: getImageUrl(game.cover?.url),
      year: game.first_release_date
        ? new Date(game.first_release_date * 1000).getFullYear()
        : 0,
    })
  );
}
