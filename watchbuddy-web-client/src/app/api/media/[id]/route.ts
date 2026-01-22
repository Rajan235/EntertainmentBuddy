import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

// Point this to your Node.js Service (e.g., http://localhost:4000)
// NOTE: Do not include '/api/media' in the env var if you append it below,
// or include it and don't append. Standardization is key.
// Recommended ENV: MEDIA_SERVICE_URL=http://localhost:4000
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  // 1. Get the 'type' query param (Required by Backend)
  // Usage: /api/media/123?type=MOVIE
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { message: "Missing 'type' query parameter" },
      { status: 400 },
    );
  }

  try {
    // 2. Forward to Node.js Backend
    // Backend expects: GET /api/media/details?id=123&type=MOVIE
    const { data } = await axios.get(`${MEDIA_SERVICE_URL}/api/media/details`, {
      params: { id, type },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[BFF Media Details] Error:`, error);
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || { message: "Media service error" },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
