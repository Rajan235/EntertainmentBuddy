import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth/cookies";
import axios, { AxiosError } from "axios";

const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:8080";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Forward the login request to your microservice using axios
    const apiRes = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, body, {
      headers: { "Content-Type": "application/json" },
    });

    // With axios, the response data is directly on the `data` property
    const data = apiRes.data;

    // 2. On success, extract the token and user data
    //    IMPORTANT: Your microservice must return a `token` and a `user` object.
    const { token, user } = data;

    if (!token || !user) {
      throw new Error("Token or user data missing from auth service response");
    }

    // 3. Create a response, set the secure cookie, and return user data
    const response = NextResponse.json(user);
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login API route error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      // Forward the error from the microservice
      return NextResponse.json(
        axiosError.response?.data || {
          message: "An error occurred during login.",
        },
        { status: axiosError.response?.status || 500 },
      );
    }

    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
