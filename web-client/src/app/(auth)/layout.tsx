import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-background/80 p-4 sm:p-6 lg:p-8">
      {/* Background pattern/decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-highlight/5 pointer-events-none" />

      {/* Centered container */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}
