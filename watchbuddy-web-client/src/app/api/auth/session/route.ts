import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";
import axios, { AxiosError } from "axios";

const MICROSERVICE_URL = process.env.MICROSERVICE_API_URL;

export async function GET(req: NextRequest) {
  try {
    // 1. Get the token from the incoming request's cookies
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    // 2. Forward the token to your microservice to validate it
    //    This endpoint should return user data if the token is valid.
    const apiRes = await axios.get(`${MICROSERVICE_URL}/auth/me`, {
      // or /auth/session, /auth/verify
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Return the user data to the client
    return NextResponse.json(apiRes.data);
  } catch (error) {
    console.error("Session check API route error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      // Forward the error from the microservice (e.g., 401 if token is invalid)
      return NextResponse.json(
        axiosError.response?.data || { message: "Session validation failed." },
        { status: axiosError.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
