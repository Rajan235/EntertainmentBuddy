"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
