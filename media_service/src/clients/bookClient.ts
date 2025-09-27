// src/clients/bookClient.ts

import axios from "axios";
import { AggregatedMediaDetail } from "../types/media";

const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";

// Open Library generally doesn't require an API key for basic lookups
const bookClient = axios.create({
  baseURL: OPEN_LIBRARY_BASE_URL,
});

export async function fetchBookDetails(
  id: string
): Promise<AggregatedMediaDetail> {
  // Open Library uses OLID (Open Library ID) which can be used in the URL
  // The details endpoint requires the ID to be prefixed, e.g., "OL12345W"
  // Assuming your externalId passed here is the full OLID.

  // Example endpoint: /works/OL458045W.json
  const { data } = await bookClient.get(`/works/${id}.json`);

  // Fetch author details separately if needed (optional complexity)

  return {
    externalId: id,
    mediaType: "BOOK",
    title: data.title,
    // Open Library descriptions can be complex objects; simplify here:
    description:
      typeof data.description === "string"
        ? data.description
        : data.description?.value || "No detailed description available.",
    releaseDate: data.created?.value || "Unknown Date", // Using creation date as proxy for first release
    posterUrl: `https://covers.openlibrary.org/b/olid/${id}-L.jpg`, // Covers are inferred by ID
    trailerUrl: undefined,
    runtime: undefined,
    status: "Completed", // Books are generally considered "Completed" works
    genres: data.subjects || [], // Subjects often serve as genres
  };
}

// ... Implement searchBooks here ...
