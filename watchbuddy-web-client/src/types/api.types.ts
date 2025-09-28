/**
 * Represents the structure of a user object returned from the API.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}

/**
 * Represents the data required for a user to log in.
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Represents the data required for a new user to register.
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
