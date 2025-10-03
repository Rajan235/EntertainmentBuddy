// src/clients/tmdbClient.ts

import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY },
});

export async function fetchMovieDetails(
  id: string
): Promise<AggregatedMediaDetail> {
  const { data } = await tmdbClient.get(`/movie/${id}`);

  // Standardize the TMDB response format
  return {
    externalId: data.id.toString(),
    mediaType: "MOVIE",
    title: data.title,
    description: data.overview,
    releaseDate: data.release_date,
    posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    trailerUrl: undefined, // Requires separate /videos call
    runtime: data.runtime,
    status: data.status,
    genres: data.genres.map((g: any) => g.name),
  };
}

export async function fetchSeriesDetails(
  id: string
): Promise<AggregatedMediaDetail> {
  // Corrected to use the /tv endpoint for series
  const { data } = await tmdbClient.get(`/tv/${id}`);

  // Standardize the TMDB response format
  return {
    externalId: data.id.toString(),
    mediaType: "SERIES",
    title: data.name, // TV series use 'name' instead of 'title'
    description: data.overview,
    releaseDate: data.first_air_date, // TV series use 'first_air_date'
    posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    trailerUrl: undefined, // Requires separate /videos call
    // Runtime for series is often per-episode
    runtime: data.episode_run_time?.[0] || undefined,
    status: data.status,
    genres: data.genres.map((g: any) => g.name),
  };
}

export async function searchMovies(query: string): Promise<SearchResult[]> {
  const { data } = await tmdbClient.get("/search/movie", {
    params: { query },
  });

  return data.results.map(
    (movie: any): SearchResult => ({
      externalId: movie.id.toString(),
      mediaType: "MOVIE",
      title: movie.title,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "",
      year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
    })
  );
}

export async function searchSeries(query: string): Promise<SearchResult[]> {
  const { data } = await tmdbClient.get("/search/tv", {
    params: { query },
  });

  return data.results.map(
    (series: any): SearchResult => ({
      externalId: series.id.toString(),
      mediaType: "SERIES",
      title: series.name, // TV series use 'name'
      posterUrl: series.poster_path
        ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
        : "",
      year: series.first_air_date
        ? new Date(series.first_air_date).getFullYear()
        : 0,
    })
  );
}
