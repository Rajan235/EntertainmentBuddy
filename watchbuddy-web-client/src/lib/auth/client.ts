import { LoginData, RegisterData, User } from "@/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Custom error class for authentication-related API errors.
 */
export class AuthError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Handles API responses, parsing JSON and throwing AuthError on failure.
 * @param response - The fetch Response object.
 * @returns The parsed JSON data.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new AuthError(
      data.message || "An unknown error occurred.",
      response.status,
      data.errors
    );
  }
  return data;
}

/**
 * Sends a login request to the API.
 * @param data - The user's login credentials.
 * @returns The user data upon successful login.
 */
export const loginClient = async (data: LoginData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
};

/**
 * Sends a registration request to the API.
 * @param data - The new user's registration details.
 * @returns The new user's data upon successful registration.
 */
export const registerClient = async (data: RegisterData): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<User>(response);
};

/**
 * Sends a logout request to the API.
 * This will typically invalidate the session/token on the server.
 */
export const logoutClient = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
    });
    // We don't need to throw an error if logout fails on the server,
    // as the client-side state will be cleared regardless.
  } catch (error) {
    console.error("Logout request failed:", error);
  }
};
