import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/cookies";

export async function POST() {
  // Create a response and clear the cookie on it
  const response = NextResponse.json({ message: "Logged out" });
  clearAuthCookie(response);

  return response;
}
