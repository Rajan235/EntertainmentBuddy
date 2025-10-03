// src/clients/bookClient.ts

import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

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
    posterUrl: `https://covers.openlibrary.org/b/id/${id}-L.jpg`, // Covers are inferred by ID
    trailerUrl: undefined,
    runtime: undefined,
    status: "Completed", // Books are generally considered "Completed" works
    genres: data.subjects || [], // Subjects often serve as genres
  };
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
  const { data } = await bookClient.get("/search.json", {
    params: {
      q: query,
      limit: 10,
    },
  });

  if (!data.docs) {
    return [];
  }

  return data.docs
    .filter((book: any) => book.cover_i) // Ensure the book has a cover image
    .map(
      (book: any): SearchResult => ({
        // The key is often like "/works/OL...W", we extract the ID part.
        externalId: book.key.split("/").pop(),
        mediaType: "BOOK",
        title: book.title,
        // Use the cover_i for the poster URL from search results
        posterUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
        year: book.first_publish_year,
      })
    );
}
