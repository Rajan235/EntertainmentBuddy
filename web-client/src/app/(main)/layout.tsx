// src/app/(main)/layout.tsx
"use client";

import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar"; // Assuming you implement these
import { TopBar } from "@/components/layout/TopBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is complete AND user is NOT authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Display loading state while checking
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  // Display main app layout once authenticated
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onLogout={logout} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
