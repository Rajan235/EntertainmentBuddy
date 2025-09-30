import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { User } from "@/types/api.types";

interface SessionPayload {
  user: User;
  accessToken: string;
  // You might have other fields like iat (issued at), exp (expires at)
}

/**
 * A server-side utility to securely get the user's session from the request cookies.
 * It reads the session cookie, verifies the JWT, and returns the session payload.
 *
 * This should be used in API Routes, Route Handlers, and Server Components.
 *
 * @returns The session payload if the token is valid, otherwise null.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session_token")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    // The secret key should be stored securely in environment variables.
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    // Verify the JWT. This will throw an error if the token is invalid or expired.
    const { payload } = await jwtVerify<SessionPayload>(sessionCookie, secret);

    return payload;
  } catch (error) {
    // This can happen if the token is malformed, expired, or the secret is wrong.
    console.error("Failed to verify session token:", error);
    return null;
  }
}
