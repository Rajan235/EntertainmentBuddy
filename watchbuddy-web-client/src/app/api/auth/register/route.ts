import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth/cookies";

const MICROSERVICE_URL = process.env.MICROSERVICE_API_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Forward the registration request to your microservice
    const apiRes = await fetch(`${MICROSERVICE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status });
    }

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
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}
