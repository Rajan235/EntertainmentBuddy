import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

// This is a placeholder for where your actual media service is hosted.
// You should add this to your .env.local file.
// e.g., MEDIA_SERVICE_URL=http://localhost:4002/api/media
const MEDIA_SERVICE_URL = process.env.MEDIA_SERVICE_URL;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!MEDIA_SERVICE_URL) {
    return NextResponse.json(
      { message: "Media service URL is not configured." },
      { status: 500 }
    );
  }

  try {
    // Using axios for the server-to-server request to the media microservice.
    const mediaServiceResponse = await axios.get(`${MEDIA_SERVICE_URL}/${id}`, {
      // Add any necessary headers, like an API key, if your service requires it.
      // headers: { 'X-API-Key': process.env.MEDIA_SERVICE_API_KEY },
    });

    // With axios, the response data is directly on the `data` property.
    return NextResponse.json(mediaServiceResponse.data);
  } catch (error) {
    console.error(`[BFF /api/media/${id}] Error:`, error);

    // Axios wraps HTTP errors in a specific object structure.
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return NextResponse.json(
        { message: axiosError.response?.data?.message || axiosError.message },
        { status: axiosError.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
