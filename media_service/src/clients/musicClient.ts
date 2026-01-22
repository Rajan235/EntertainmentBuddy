import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

// --- 1. Strong Types for Spotify ---

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyAlbum {
  name: string;
  release_date: string; // "2023-01-01"
  images: SpotifyImage[];
}

interface SpotifyTrackRaw {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  preview_url: string | null; // 30s audio clip
}

interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrackRaw[];
  };
}

interface SpotifyToken {
  access_token: string;
  expires_at: number;
}

// --- 2. Robust Auth (Singleton Pattern - Reused from IGDB) ---

let tokenCache: SpotifyToken | null = null;
let tokenRefreshPromise: Promise<string> | null = null;

async function getSpotifyToken(): Promise<string> {
  if (tokenCache && tokenCache.expires_at > Date.now()) {
    return tokenCache.access_token;
  }

  if (tokenRefreshPromise) return tokenRefreshPromise;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify Client ID or Secret is not configured.");
  }

  tokenRefreshPromise = (async () => {
    try {
      // Spotify requires Basic Auth (Base64 encoded ID:Secret)
      const authHeader = Buffer.from(
        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64");

      const params = new URLSearchParams();
      params.append("grant_type", "client_credentials");

      const response = await axios.post(SPOTIFY_AUTH_URL, params, {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, expires_in } = response.data;
      tokenCache = {
        access_token,
        expires_at: Date.now() + (expires_in - 60) * 1000,
      };
      return access_token;
    } catch (error) {
      console.error("❌ Spotify Auth Failed:", error);
      throw error;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
}

// --- 3. The Client ---

const musicClient = axios.create({ baseURL: SPOTIFY_BASE_URL });

musicClient.interceptors.request.use(async (config) => {
  const token = await getSpotifyToken();
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// --- 4. Service Functions ---

export async function searchTracks(query: string): Promise<SearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const { data } = await musicClient.get<SpotifySearchResponse>("/search", {
      params: {
        q: cleanQuery,
        type: "track",
        limit: 10,
      },
    });

    return data.tracks.items.map((track) => ({
      externalId: track.id,
      mediaType: "MUSIC",
      // Title format: "Song Name - Artist Name"
      title: `${track.name} - ${track.artists[0].name}`,

      posterUrl: track.album.images[0]?.url || "",

      // Robust Year Extraction
      year: track.album.release_date
        ? parseInt(track.album.release_date.split("-")[0])
        : 0,

      status: track.artists[0].name, // Show Artist in status field
    }));
  } catch (error) {
    console.error("❌ Spotify Search Error:", error);
    return [];
  }
}

export async function fetchMusicDetails(
  id: string,
): Promise<AggregatedMediaDetail> {
  try {
    const { data } = await musicClient.get<SpotifyTrackRaw>(`/tracks/${id}`);

    return {
      externalId: data.id,
      mediaType: "MUSIC",
      title: data.name,
      description: `Track by ${data.artists.map((a) => a.name).join(", ")} from the album "${data.album.name}".`,

      releaseDate: data.album.release_date || "Unknown",

      posterUrl: data.album.images[0]?.url || "",

      // Feature: Spotify gives 30s audio previews!
      trailerUrl: data.preview_url,

      runtime: Math.round(data.duration_ms / 1000), // Convert ms to seconds

      status: "Released",
      genres: [], // Spotify tracks don't have genres, Artists do. Keeping empty for speed.

      rating: data.popularity / 10, // Convert 0-100 to 0-10
    };
  } catch (error) {
    console.error(`❌ Spotify Detail Error ${id}:`, error);
    throw new Error("Track not found");
  }
}
