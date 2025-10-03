// src/clients/animeClient.ts

import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const ANIME_BASE_URL = "https://api.jikan.moe/v4"; // Example: Jikan (MyAnimeList unofficial API)

const animeClient = axios.create({ baseURL: ANIME_BASE_URL });

export async function fetchAnimeDetails(
  id: string
): Promise<AggregatedMediaDetail> {
  const { data } = await animeClient.get(`/anime/${id}`);
  const anime = data.data;

  return {
    externalId: anime.mal_id.toString(),
    mediaType: "ANIME",

    title: anime.title_english || anime.title,
    description: anime.synopsis,
    releaseDate: anime.aired.from,
    posterUrl: anime.images.jpg.image_url,
    trailerUrl: anime.trailer.embed_url,
    runtime: anime.episodes * 23, // Estimate
    status: anime.status.replace(/[^a-zA-Z]/g, ""), // Clean status string
    genres: anime.genres.map((g: any) => g.name),
  };
}

//need to reviw this function

export async function searchAnime(query: string): Promise<SearchResult[]> {
  const { data } = await animeClient.get("/anime", {
    params: {
      q: query,
      limit: 10, // Limit results to a reasonable number
    },
  });

  if (!data.data) {
    return [];
  }

  return data.data.map(
    (anime: any): SearchResult => ({
      externalId: anime.mal_id.toString(),
      mediaType: "ANIME",
      title: anime.title_english || anime.title,
      posterUrl: anime.images?.jpg?.image_url || "",
      year: anime.year,
    })
  );
}
