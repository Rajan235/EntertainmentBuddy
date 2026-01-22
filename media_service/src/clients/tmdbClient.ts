import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// --- 1. Strong Typing for TMDB ---

interface TMDBVideo {
  key: string;
  site: string;
  type: string;
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBBase {
  id: number;
  overview: string;
  poster_path?: string;
  vote_average?: number;
  status: string;
  genres: TMDBGenre[];
  videos?: {
    results: TMDBVideo[];
  };
}

// Movies and TV have slightly different fields
interface TMDBMovie extends TMDBBase {
  title: string;
  release_date: string;
  runtime: number;
}

interface TMDBShow extends TMDBBase {
  name: string;
  first_air_date: string;
  episode_run_time: number[]; // Array of runtimes (e.g. [45, 50])
}

interface TMDBSearchResult {
  results: any[]; // We map this manually below
}

// --- 2. The Client ---

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "en-US", // Good practice to specify language
  },
});

// Helper: Extract YouTube Trailer
const getTrailer = (videos?: { results: TMDBVideo[] }): string | null => {
  const trailer = videos?.results.find(
    (v) => v.site === "YouTube" && v.type === "Trailer",
  );
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
};

// --- 3. Service Functions ---

export async function fetchMovieDetails(
  id: string,
): Promise<AggregatedMediaDetail> {
  try {
    // MAGICAL PARAM: 'append_to_response=videos' gets the trailer in the SAME request
    const { data } = await tmdbClient.get<TMDBMovie>(`/movie/${id}`, {
      params: { append_to_response: "videos" },
    });

    return {
      externalId: data.id.toString(),
      mediaType: "MOVIE",
      title: data.title,
      description: data.overview,
      releaseDate: data.release_date || "Unknown",
      posterUrl: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "",

      trailerUrl: getTrailer(data.videos), // Now we have it instantly!

      runtime: data.runtime || 0,
      status: data.status,
      genres: data.genres.map((g) => g.name),
      rating: data.vote_average ? data.vote_average : 0, // 0-10 scale matches TMDB perfectly
    };
  } catch (error) {
    console.error(`❌ TMDB Movie Detail Error ${id}:`, error);
    throw new Error("Movie not found");
  }
}

export async function fetchSeriesDetails(
  id: string,
): Promise<AggregatedMediaDetail> {
  try {
    const { data } = await tmdbClient.get<TMDBShow>(`/tv/${id}`, {
      params: { append_to_response: "videos" },
    });

    return {
      externalId: data.id.toString(),
      mediaType: "SERIES",
      title: data.name,
      description: data.overview,
      releaseDate: data.first_air_date || "Unknown",
      posterUrl: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "",

      trailerUrl: getTrailer(data.videos),

      // Series runtime is an array (e.g., [22, 24]). We take the average or first one.
      runtime: data.episode_run_time?.[0] || 0,

      status: data.status,
      genres: data.genres.map((g) => g.name),
      rating: data.vote_average || 0,
    };
  } catch (error) {
    console.error(`❌ TMDB Series Detail Error ${id}:`, error);
    throw new Error("Series not found");
  }
}

// Unified Search (Optimized)
export async function searchMovies(query: string): Promise<SearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const { data } = await tmdbClient.get<TMDBSearchResult>("/search/movie", {
      params: { query: cleanQuery },
    });

    return data.results.map((m: any) => ({
      externalId: m.id.toString(),
      mediaType: "MOVIE",
      title: m.title,
      posterUrl: m.poster_path
        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
        : "",
      year: m.release_date ? parseInt(m.release_date.substring(0, 4)) : 0,
      status: m.vote_average ? `⭐ ${m.vote_average}` : "Unknown", // Show Rating in status
    }));
  } catch (error) {
    return [];
  }
}

export async function searchSeries(query: string): Promise<SearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const { data } = await tmdbClient.get<TMDBSearchResult>("/search/tv", {
      params: { query: cleanQuery },
    });

    return data.results.map((s: any) => ({
      externalId: s.id.toString(),
      mediaType: "SERIES",
      title: s.name,
      posterUrl: s.poster_path
        ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
        : "",
      year: s.first_air_date ? parseInt(s.first_air_date.substring(0, 4)) : 0,
      status: s.vote_average ? `⭐ ${s.vote_average}` : "Unknown",
    }));
  } catch (error) {
    return [];
  }
}
