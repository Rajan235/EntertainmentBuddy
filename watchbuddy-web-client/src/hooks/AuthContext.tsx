"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loginClient,
  registerClient,
  logoutClient,
  AuthError,
} from "@/lib/auth/client"; // Will create this next
import { LoginData, RegisterData, User } from "@/types/api.types"; // Assuming these types exist

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  // --- 1. INITIAL LOAD: Check session on startup (e.g., validate token) ---
  useEffect(() => {
    // In a real app, you'd call a Next.js API route here to validate the JWT
    // stored in a secure HttpOnly cookie. For this example, we'll simulate.
    const checkSession = async () => {
      // TODO: Implement token validation logic here
      // This is where you might call an endpoint like /api/auth/session

      // Simulating a successful session check
      const storedUser = localStorage.getItem("watchbuddy_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // --- 2. AUTHENTICATION HANDLERS ---

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginClient(data); // Calls the API client
      setUser(userData);
      localStorage.setItem("watchbuddy_user", JSON.stringify(userData)); // Temp storage for user data
      router.push("/"); // Redirect to dashboard
    } catch (e) {
      setError(e as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await registerClient(data);
      setUser(userData);
      localStorage.setItem("watchbuddy_user", JSON.stringify(userData)); // Temp storage for user data
      router.push("/"); // Redirect to dashboard
    } catch (e) {
      setError(e as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutClient(); // Calls the API client to clear cookies/token
    setUser(null);
    localStorage.removeItem("watchbuddy_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --- 3. The Hook ---
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
