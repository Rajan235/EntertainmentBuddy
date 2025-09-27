// src/clients/tmdbClient.ts

import axios from "axios";
import { AggregatedMediaDetail } from "../types/media";

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
// ... Add searchMovies/Series here
