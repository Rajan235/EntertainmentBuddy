import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q"); // The search term

  if (!q) {
    return NextResponse.json({ message: "Missing query" }, { status: 400 });
  }

  try {
    // Forward to Node.js Backend: /api/media/search?q=Harry Potter
    // Note: We don't pass 'type' here so it searches ALL categories (Unified Search)
    const { data } = await axios.get(`${MEDIA_SERVICE_URL}/api/media/search`, {
      params: { q },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[BFF Search] Error:`, error);
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
}
