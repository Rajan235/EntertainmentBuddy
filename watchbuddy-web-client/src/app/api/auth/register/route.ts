import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth/cookies";
import axios, { AxiosError } from "axios";

const MICROSERVICE_URL = process.env.MICROSERVICE_API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Forward the registration request to your microservice using axios
    const apiRes = await axios.post(`${MICROSERVICE_URL}/auth/register`, body, {
      headers: { "Content-Type": "application/json" },
    });

    const data = apiRes.data;

    // 2. On success, extract token and user data
    const { token, user } = data;
    if (!token || !user) {
      throw new Error("Token or user data missing from auth service response");
    }

    // 3. Set the cookie and return user data
    const response = NextResponse.json(user);
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Register API route error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      // Forward the error from the microservice
      return NextResponse.json(
        axiosError.response?.data || {
          message: "An error occurred during registration.",
        },
        { status: axiosError.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
