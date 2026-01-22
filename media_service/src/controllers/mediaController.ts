import { Request, Response, NextFunction } from "express";
import * as mediaService from "../services/mediaService";
import { MediaType } from "../types/media";
import { MediaNotFoundError } from "../errors/error"; // Import from shared file

const VALID_MEDIA_TYPES: MediaType[] = [
  "MOVIE",
  "SERIES",
  "GAME",
  "ANIME",
  "BOOK",
  "MUSIC",
];

// Helper to check validity
const isValidMediaType = (type: string): type is MediaType =>
  (VALID_MEDIA_TYPES as string[]).includes(type);

/**
 * 1. GET DETAILS (Strict)
 * Must provide ID and TYPE.
 * Usage: /api/media/details?type=MOVIE&id=123
 */
export const getMediaDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { type, id } = req.query;

  // Validation
  if (!id || !type) {
    return res
      .status(400)
      .json({ message: "Missing 'id' or 'type' query parameter." });
  }

  const mediaTypeStr = type.toString().toUpperCase();
  if (!isValidMediaType(mediaTypeStr)) {
    return res
      .status(400)
      .json({ message: `Invalid media type: ${mediaTypeStr}` });
  }

  try {
    const details = await mediaService.getAggregatedDetails(
      mediaTypeStr,
      id.toString(),
    );
    return res.status(200).json(details);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    next(error); // Pass to global error handler
  }
};

/**
 * 2. UNIFIED SEARCH (Flexible)
 * If 'type' is missing, it searches EVERYTHING.
 * Usage: /api/media/search?q=Harry Potter (Returns mixed results)
 * Usage: /api/media/search?q=Harry Potter&type=BOOK (Returns only books)
 */
export const searchMediaController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { q, type } = req.query; // Changed 'query' to 'q' (standard convention)

  if (!q) {
    return res.status(400).json({ message: "Missing 'q' search parameter." });
  }

  const searchQuery = q.toString();

  // Logic: Did the user ask for a specific type?
  const requestedType = type ? type.toString().toUpperCase() : null;

  try {
    let results;

    if (requestedType) {
      // Specific Search (e.g., just Movies)
      if (!isValidMediaType(requestedType)) {
        return res
          .status(400)
          .json({ message: `Invalid media type: ${requestedType}` });
      }
      results = await mediaService.searchMedia(requestedType, searchQuery);
    } else {
      // Unified Search (The "Traffic Cop" Mode)
      // This calls the service which runs ALL clients in parallel
      results = await mediaService.searchAllCategories(searchQuery);
    }

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};
