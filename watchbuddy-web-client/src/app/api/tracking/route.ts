import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";

const TRACKING_SERVICE_URL = process.env.TRACKING_SERVICE_URL; // e.g., http://localhost:8081

// Helper to get headers
const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthorized");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// 1. GET: Fetch User's Watchlist
export async function GET() {
  try {
    const headers = await getAuthHeaders();

    // Backend: GET /entries
    const { data } = await axios.get(`${TRACKING_SERVICE_URL}/entries`, {
      headers,
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleAxiosError(error);
  }
}

// 2. POST: Add/Update Item
export async function POST(req: NextRequest) {
  try {
    const headers = await getAuthHeaders();
    const body = await req.json();

    // Backend: POST /entries (Body: { mediaId, status, type, ... })
    const { data } = await axios.post(`${TRACKING_SERVICE_URL}/entries`, body, {
      headers,
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleAxiosError(error);
  }
}

// Shared Error Handler
function handleAxiosError(error: any) {
  if (error.message === "Unauthorized") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.error("[BFF Tracking] Error:", error);
  if (axios.isAxiosError(error)) {
    return NextResponse.json(
      error.response?.data || { message: "Tracking service error" },
      { status: error.response?.status || 500 },
    );
  }
  return NextResponse.json({ message: "Internal Error" }, { status: 500 });
}
