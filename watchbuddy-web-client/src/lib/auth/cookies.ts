import { serialize } from "cookie";
import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "watchbuddy_token";

/**
 * Sets the authentication token in a secure, HttpOnly cookie.
 * @param response - The NextResponse object to set the cookie on.
 * @param token - The JWT to be stored.
 */
export function setAuthCookie(response: NextResponse, token: string) {
  const cookie = serialize(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use 'secure' in production
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  response.headers.append("Set-Cookie", cookie);
}

/**
 * Clears the authentication cookie.
 * @param response - The NextResponse object to modify.
 */
export function clearAuthCookie(response: NextResponse) {
  const cookie = serialize(AUTH_COOKIE_NAME, "", {
    maxAge: -1, // Expire the cookie immediately
    path: "/",
  });

  response.headers.append("Set-Cookie", cookie);
}
