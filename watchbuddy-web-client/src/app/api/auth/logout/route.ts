import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, AUTH_COOKIE_NAME } from "@/lib/auth/cookies";
import { cookies } from "next/headers";
import axios from "axios";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  // 1. (Optional) Notify Backend to invalidate session in Redis
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (token) {
      //  - Diagram: Next.js sends POST to Backend to clear Redis session
      await axios.post(
        `${AUTH_SERVICE_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    }
  } catch (error) {
    // Ignore backend errors during logout (user just wants to sign out)
    console.warn("Backend logout failed, clearing local cookie anyway.");
  }

  // 2. Clear Local Cookie (Always do this)
  const response = NextResponse.json({ message: "Logged out" });
  clearAuthCookie(response);

  return response;
}
