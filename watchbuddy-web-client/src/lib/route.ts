import { NextResponse } from "next/server";
import { getMediaDetailsById } from "@/lib/mock-data";

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     description: Returns the details for a specific media item
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details
 *       404:
 *         description: Media not found
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const media = getMediaDetailsById(params.id);

  if (!media) {
    return new NextResponse("Media not found", { status: 404 });
  }

  return NextResponse.json(media);
}
