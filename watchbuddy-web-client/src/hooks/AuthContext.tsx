"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  loginClient,
  registerClient,
  logoutClient,
  AuthError,
  getSessionClient as getSession,
} from "@/lib/auth/client"; // Will create this next
import { LoginData, RegisterData, User } from "@/types/api.types"; // Assuming these types exist
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: LoginData) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
  isLoggingIn: boolean;
  loginError: AuthError | null;
  isRegistering: boolean;
  registerError: AuthError | null;
  isSessionLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- 1. Query for the current user session ---
  // This query will run on mount and whenever we invalidate it.
  const {
    data: user,
    isLoading: isSessionLoading,
    isError,
  } = useQuery<User | null, AuthError>({
    queryKey: ["user"],
    queryFn: getSession, // API call to /api/auth/session
    retry: false, // Don't retry on 401/403 errors
    refetchOnWindowFocus: false, // Optional: set to true to refetch on focus
  });

  // --- 2. Mutations for auth actions ---

  const onAuthSuccess = (data: User) => {
    queryClient.setQueryData(["user"], data); // Manually update the 'user' query cache
    router.push("/dashboard");
  };

  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation<User, AuthError, LoginData>({
    mutationFn: loginClient,
    onSuccess: onAuthSuccess,
  });

  const {
    mutate: register,
    isPending: isRegistering,
    error: registerError,
  } = useMutation<User, AuthError, RegisterData>({
    mutationFn: registerClient,
    onSuccess: onAuthSuccess,
  });

  const { mutate: logout } = useMutation({
    mutationFn: logoutClient,
    onSuccess: () => {
      queryClient.setQueryData(["user"], null); // Clear user data
      router.push("/login");
    },
  });

  // If the initial session check results in an error (e.g., invalid cookie),
  // ensure the user data is cleared from the cache.
  useEffect(() => {
    if (isError) {
      queryClient.setQueryData(["user"], null);
    }
  }, [isError, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoggingIn,
        loginError,
        isRegistering,
        registerError,
        isSessionLoading,
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
