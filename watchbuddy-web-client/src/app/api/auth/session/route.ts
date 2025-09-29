import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";

const MICROSERVICE_URL = process.env.MICROSERVICE_API_URL;

export async function GET(req: NextRequest) {
  // 1. Get the token from the incoming request's cookies
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    // 2. Forward the token to your microservice to validate it
    //    This endpoint should return user data if the token is valid.
    const apiRes = await fetch(`${MICROSERVICE_URL}/auth/me`, {
      // or /auth/session, /auth/verify
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(user, { status: apiRes.status });
    }

    // 3. Return the user data to the client
    return NextResponse.json(user);
  } catch (error) {
    console.error("Session check API route error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
