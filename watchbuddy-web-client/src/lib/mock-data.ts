import {
  Category,
  ProgressStatus,
  TrackingEntry,
} from "@/types/tracking.types";
import { MediaDetails } from "@/types/media.types";

// ============================================================================
// 1. THE USER'S TRACKING LIST (Mutable)
// This simulates your Postgres Database.
// ============================================================================
export let MOCK_USER_LIST: TrackingEntry[] = [
  {
    id: "1",
    title: "Shōgun",
    category: Category.SERIES,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/5zmiBoMzeeVdQ62no55JOJMY498.jpg",
    progress: 8,
    totalEpisodes: 10,
    rating: 9.2,
    genres: ["Drama", "History", "War"],
  },
  {
    id: "2",
    title: "Dune: Part Two",
    category: Category.MOVIE,
    status: ProgressStatus.COMPLETED,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: 9.0,
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    id: "3",
    title: "Helldivers 2",
    category: Category.GAME,
    status: ProgressStatus.IN_PROGRESS,
    posterUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co848y.jpg",
    rating: 8.5,
    genres: ["Shooter", "Action"],
  },
];

// ============================================================================
// 2. THE GLOBAL MEDIA DATABASE (Immutable)
// This simulates TMDB/IGDB. It contains everything, including things NOT tracked.
// ============================================================================
const MOCK_DATABASE: Record<string, MediaDetails> = {
  // --- TRACKED ITEMS (Must match IDs above) ---
  "1": {
    id: "1",
    title: "Shōgun",
    description:
      "In 1600s Japan, Lord Yoshii Toranaga is fighting for his life as his enemies on the Council of Regents unite against him.",
    category: Category.SERIES,
    releaseDate: "2024-02-27",
    status: "Returning Series",
    rating: 9.2,
    totalRatings: 15234,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/5zmiBoMzeeVdQ62no55JOJMY498.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/5zmiBoMzeeVdQ62no55JOJMY498.jpg",
    genres: ["Drama", "History", "War"],
    creators: ["Rachel Kondo", "Justin Marks"],
    cast: ["Hiroyuki Sanada", "Cosmo Jarvis", "Anna Sawai"],
    totalEpisodes: 10,
    platforms: ["Hulu", "Disney+", "FX"], // 👈 Added
  },
  "2": {
    id: "2",
    title: "Dune: Part Two",
    description:
      "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    category: Category.MOVIE,
    releaseDate: "2024-03-01",
    status: "Released",
    rating: 8.9,
    totalRatings: 25000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    genres: ["Sci-Fi", "Adventure"],
    creators: ["Denis Villeneuve"],
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    platforms: ["Max", "Apple TV", "Amazon Prime"], // 👈 Added
    totalEpisodes: 166, // Runtime in mins
  },
  "3": {
    id: "3",
    title: "Helldivers 2",
    description:
      "Join the Helldivers and fight for freedom with friends across a hostile galaxy in this fast, frantic third-person shooter.",
    category: Category.GAME,
    releaseDate: "2024-02-08",
    status: "Released",
    rating: 8.5,
    totalRatings: 5000,
    posterUrl:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co848y.jpg",
    backdropUrl:
      "https://images.igdb.com/igdb/image/upload/t_screenshot_big/scfw7f.jpg",
    genres: ["Shooter", "Action"],
    creators: ["Arrowhead Game Studios"],
    platforms: ["PC (Steam)", "PlayStation 5"],
    cast: [],
  },

  // --- UNTRACKED ITEM (For testing "Add to List") ---
  "999": {
    id: "999",
    title: "Inception",
    description:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception".',
    category: Category.MOVIE,
    releaseDate: "2010-07-15",
    status: "Released",
    rating: 8.8,
    totalRatings: 35000,
    posterUrl:
      "https://image.tmdb.org/t/p/w500/9gk7admal4ZLvd9ZrWHtHeZQ9Am.jpg",
    backdropUrl:
      "https://image.tmdb.org/t/p/original/s3TBrRGB1jav7y4argmKmJ.jpg",
    genres: ["Action", "Sci-Fi", "Adventure"],
    creators: ["Christopher Nolan"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
    totalEpisodes: 148, // Runtime
  },
};

// ============================================================================
// 3. HELPER FUNCTIONS (Simulating the Backend)
// ============================================================================

/**
 * Simulates: GET /api/media/:id
 * Fetches static details AND merges user progress if it exists.
 */
export function getMediaDetailsById(id: string): MediaDetails | null {
  // 1. Try to find the static details (TMDB data)
  const staticDetails = MOCK_DATABASE[id];

  if (!staticDetails) return null; // 404 Not Found

  // 2. Check if the User is tracking this item
  const userEntry = MOCK_USER_LIST.find((entry) => entry.id === id);

  // 3. Merge them!
  // If userEntry exists, we overlay their Status/Progress onto the static data.
  // If not, we return the static data clean (so the UI shows "Add to List").
  if (userEntry) {
    return {
      ...staticDetails,
      // Map User Data to the safe optional fields
      userStatus: userEntry.status,
      userProgress: userEntry.progress,
      userRating: userEntry.rating,
    };
  }

  return staticDetails;
}

/**
 * Simulates: GET /api/media/search?q=...
 */
export function searchMockMedia(query: string): TrackingEntry[] {
  const lowerQuery = query.toLowerCase();

  // Convert our Database object to an array and filter
  return Object.values(MOCK_DATABASE)
    .filter((item) => item.title.toLowerCase().includes(lowerQuery))
    .map((item) => ({
      // Convert MediaDetails to simpler TrackingEntry for the grid
      id: item.id,
      title: item.title,
      category: item.category,
      posterUrl: item.posterUrl,
      status:
        MOCK_USER_LIST.find((e) => e.id === item.id)?.status ||
        ProgressStatus.PLANNING, // Fake status for preview
      genres: item.genres,
      rating: item.rating,
    }));
}
