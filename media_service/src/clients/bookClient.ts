// // src/clients/bookClient.ts

// import axios from "axios";
// import { AggregatedMediaDetail, SearchResult } from "../types/media";

// const OPEN_LIBRARY_BASE_URL = "https://openlibrary.org";

// // Open Library generally doesn't require an API key for basic lookups
// const bookClient = axios.create({
//   baseURL: OPEN_LIBRARY_BASE_URL,
// });

// export async function fetchBookDetails(
//   id: string
// ): Promise<AggregatedMediaDetail> {
//   // Open Library uses OLID (Open Library ID) which can be used in the URL
//   // The details endpoint requires the ID to be prefixed, e.g., "OL12345W"
//   // Assuming your externalId passed here is the full OLID.

//   // Example endpoint: /works/OL458045W.json
//   const { data } = await bookClient.get(`/works/${id}.json`);

//   // Fetch author details separately if needed (optional complexity)

//   return {
//     externalId: id,
//     mediaType: "BOOK",
//     title: data.title,
//     // Open Library descriptions can be complex objects; simplify here:
//     description:
//       typeof data.description === "string"
//         ? data.description
//         : data.description?.value || "No detailed description available.",
//     releaseDate: data.created?.value || "Unknown Date", // Using creation date as proxy for first release
//     posterUrl: `https://covers.openlibrary.org/b/id/${id}-L.jpg`, // Covers are inferred by ID
//     trailerUrl: undefined,
//     runtime: undefined,
//     status: "Completed", // Books are generally considered "Completed" works
//     genres: data.subjects || [], // Subjects often serve as genres
//   };
// }

// export async function searchBooks(query: string): Promise<SearchResult[]> {
//   const { data } = await bookClient.get("/search.json", {
//     params: {
//       q: query,
//       limit: 10,
//     },
//   });

//   if (!data.docs) {
//     return [];
//   }

//   return data.docs
//     .filter((book: any) => book.cover_i) // Ensure the book has a cover image
//     .map(
//       (book: any): SearchResult => ({
//         // The key is often like "/works/OL...W", we extract the ID part.
//         externalId: book.key.split("/").pop(),
//         mediaType: "BOOK",
//         title: book.title,
//         // Use the cover_i for the poster URL from search results
//         posterUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
//         year: book.first_publish_year,
//       })
//     );
// }
import axios from "axios";
import { AggregatedMediaDetail, SearchResult } from "../types/media";

const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1";
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

// --- 1. Strong Typing for Google Books Response ---

interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  publishedDate?: string; // Formats: "2023-01-01" or "2023"
  imageLinks?: {
    smallThumbnail?: string;
    thumbnail?: string;
  };
  pageCount?: number;
  categories?: string[]; // Genres
  averageRating?: number;
}

interface GoogleBookItem {
  id: string; // This is the ID we use (e.g. "zyTCAlFPjgYC")
  volumeInfo: GoogleBookVolumeInfo;
}

interface GoogleBooksSearchResponse {
  totalItems: number;
  items?: GoogleBookItem[];
}

// --- 2. The Client Setup ---

const bookClient = axios.create({
  baseURL: GOOGLE_BOOKS_BASE_URL,
  params: {
    key: API_KEY, // Automatically attaches key to every request
  },
});

// --- 3. Service Functions ---

export async function searchBooks(query: string): Promise<SearchResult[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const { data } = await bookClient.get<GoogleBooksSearchResponse>(
      "/volumes",
      {
        params: {
          q: cleanQuery,
          maxResults: 10,
          printType: "books", // Filter out magazines to keep it relevant
        },
      },
    );

    if (!data.items) return [];

    return data.items.map((book) => {
      const info = book.volumeInfo;
      return {
        externalId: book.id,
        mediaType: "BOOK",
        title: info.title,

        // Fix: Google returns 'http' images which cause "Not Secure" warnings. Force HTTPS.
        posterUrl: info.imageLinks?.thumbnail?.replace("http:", "https:") || "",

        // Robust Year Extraction: Handle "2023-05-01" or "2023"
        year: info.publishedDate
          ? parseInt(info.publishedDate.substring(0, 4))
          : 0,

        // UX Improvement: Show Author in the status field for the search card
        status: info.authors ? info.authors[0] : "Unknown Author",
      };
    });
  } catch (error) {
    console.error("❌ Google Books Search Error:", error);
    return [];
  }
}

export async function fetchBookDetails(
  id: string,
): Promise<AggregatedMediaDetail> {
  try {
    const { data } = await bookClient.get<GoogleBookItem>(`/volumes/${id}`);
    const info = data.volumeInfo;

    return {
      externalId: data.id,
      mediaType: "BOOK",
      title: info.title,

      // Feature: Google returns HTML descriptions (<b>, <br>). We clean them for the UI.
      description:
        info.description?.replace(/<\/?[^>]+(>|$)/g, "") ||
        "No description available.",

      releaseDate: info.publishedDate || "Unknown",

      posterUrl: info.imageLinks?.thumbnail?.replace("http:", "https:") || "",

      trailerUrl: null, // Books don't have trailers

      // Feature: Map 'Page Count' to runtime so the UI shows "350 pages"
      runtime: info.pageCount || 0,

      status: "Released",
      genres: info.categories || [],

      rating: info.averageRating || 0,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch book details for ID ${id}:`, error);
    throw new Error("Book not found");
  }
}
