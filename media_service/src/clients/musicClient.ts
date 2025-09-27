// src/clients/musicClient.ts

import axios from "axios";
import { AggregatedMediaDetail } from "../types/media";

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_BASE_URL = "http://ws.audioscrobbler.com/2.0/";

const musicClient = axios.create({
  baseURL: LASTFM_BASE_URL,
});

export async function fetchMusicDetails(
  trackName: string,
  artistName: string
): Promise<AggregatedMediaDetail> {
  // Last.fm typically uses composite IDs (Artist + Track Name)
  // You would pass the standardized title and artist name here.

  const response = await musicClient.get("/", {
    params: {
      method: "track.getInfo",
      api_key: LASTFM_API_KEY,
      artist: artistName,
      track: trackName,
      format: "json",
    },
  });

  const data = response.data.track;

  // Last.fm does not provide a single stable ID easily for track.getInfo,
  // so we create a composite ID for internal use (or rely on persistent DB for stability)
  const compositeId = `${data.artist.name.replace(
    /\s/g,
    "_"
  )}_${data.name.replace(/\s/g, "_")}`;

  return {
    externalId: compositeId,
    mediaType: "MUSIC",
    title: data.name,
    description: data.wiki?.content || `Track by ${data.artist.name}`,
    releaseDate: data.wiki?.published || "Unknown Date",
    // Last.fm provides images for albums, so getting a track image is tricky; using placeholder:
    posterUrl:
      data.album?.image.find((img: any) => img.size === "large")?.["#text"] ||
      "",
    trailerUrl: undefined,
    runtime: parseInt(data.duration) / 1000, // Duration is in milliseconds
    status: "Released",
    genres: data.toptags.tag.map((t: any) => t.name),
  };
}

// ... Implement searchTracks/searchAlbums here ...
