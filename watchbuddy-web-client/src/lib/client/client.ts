import axios, { AxiosError } from "axios";

// Create an axios instance. This allows you to configure base URLs,
// headers, and interceptors in a single place.
const axiosInstance = axios.create({
  // Your BFF's base URL. All requests from the client will go here.
  // We can use a relative URL because the client is on the same domain.
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * A generic fetch client for making API requests from the client-side.
 * It automatically handles JSON parsing and error handling for non-ok responses.
 *
 * @param url - The URL to fetch, relative to the base URL (e.g., '/tracking').
 * @param options - Optional fetch options (method, headers, body, etc.).
 */
export async function apiClient<T>(
  url: string,
  options?: { method?: "GET" | "POST" | "PUT" | "DELETE"; data?: unknown }
): Promise<T> {
  try {
    const response = await axiosInstance({ url, ...options });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    // Re-throw a simpler error for React Query to handle.
    throw new Error(
      axiosError.response?.data?.message ||
        axiosError.message ||
        "An unknown API error occurred"
    );
  }
}
