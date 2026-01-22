import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category"); // e.g. "MOVIE" or "ALL"

  try {
    // Forward to Node.js Backend
    const { data } = await axios.get(
      `${MEDIA_SERVICE_URL}/api/media/trending`,
      {
        params: { category },
      },
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching trending" },
      { status: 500 },
    );
  }
}
