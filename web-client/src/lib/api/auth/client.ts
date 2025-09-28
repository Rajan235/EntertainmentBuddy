import axios from 'axios';
import { LoginData, RegisterData, User } from '@/types/api.types';

// Define the base URL for the API Gateway (or your Next.js API route handler)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080/api/auth';

// Custom Error Type
export interface AuthError extends Error {
  status?: number;
  message: string;
}

// --- Axios Instance ---
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // IMPORTANT: Allows sending/receiving cookies for JWT security
});

// --- 1. Login ---
export async function loginClient(data: LoginData): Promise<User> {
  try {
    const response = await authAxios.post('/login', data);
    
    // Assuming the Spring Auth Service sets an HttpOnly cookie and returns user data
    return response.data as User; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'Login failed due to network error.';
      throw { message, status } as AuthError;
    }
    throw { message: 'An unknown error occurred.' } as AuthError;
  }
}

// --- 2. Register ---
export async function registerClient(data: RegisterData): Promise<User> {
  try {
    const response = await authAxios.post('/register', { 
        email: data.email, 
        password: data.password, 
        username: data.username 
    });
    
    // Assuming successful registration also logs the user in
    return response.data as User; 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = error.response.data.message || 'Registration failed.';
      throw { message, status } as AuthError;
    }
    throw { message: 'An unknown error occurred.' } as AuthError;
  }
}

// --- 3. Logout ---
export function logoutClient(): void {
  // In a robust app, this would call an endpoint to invalidate the server-side session/token.
  // Example: authAxios.post('/logout');
  // For now, it just cleans up the client side.
}