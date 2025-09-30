import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/server"; // Assuming you have a server-side session utility
import axios, { AxiosError } from "axios";

export async function GET() {
  try {
    // 1. Authenticate the request from the client
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Call the downstream tracking microservice
    // The URL should come from environment variables for security and flexibility.
    const trackingServiceUrl = `${process.env.TRACKING_SERVICE_URL}/entries`;

    // Using axios for the server-to-server request
    const trackingServiceResponse = await axios.get(trackingServiceUrl, {
      headers: {
        // Forward the user's authentication token to the microservice
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // With axios, the response data is directly on the `data` property
    return NextResponse.json(trackingServiceResponse.data);
  } catch (error) {
    console.error("[BFF /api/tracking] Error:", error);

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
