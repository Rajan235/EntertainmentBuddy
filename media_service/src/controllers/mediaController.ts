// src/controllers/mediaController.ts

import { Request, Response, NextFunction } from "express";
import * as mediaService from "../services/mediaService";
import { MediaType, SearchResult } from "../types/media";

// A custom error for when media is not found. This is better than generic Errors.
class MediaNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaNotFoundError";
  }
}

const VALID_MEDIA_TYPES: MediaType[] = [
  "MOVIE",
  "SERIES",
  "GAME",
  "ANIME",
  "BOOK",
  "MUSIC",
];
const isValidMediaType = (type: string): type is MediaType =>
  (VALID_MEDIA_TYPES as string[]).includes(type);

/**
 * Middleware to validate the 'type' query parameter.
 * This avoids code duplication in controllers.
 */
export const validateMediaType = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type } = req.query;
  if (!type) {
    return res.status(400).json({ message: "Missing type query parameter." });
  }

  const mediaTypeStr = type.toString().toUpperCase();
  if (!isValidMediaType(mediaTypeStr)) {
    return res.status(400).json({
      message: `Invalid media type: ${mediaTypeStr}. Must be one of: ${VALID_MEDIA_TYPES.join(
        ", "
      )}`,
    });
  }
  next();
};

export const getMediaDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { type, id } = req.query;

  if (!id) {
    res.status(400).json({ message: "Missing id query parameter." });
    return;
  }

  const mediaType = type!.toString().toUpperCase() as MediaType;
  const externalId = id.toString();

  try {
    const details = await mediaService.getAggregatedDetails(
      mediaType,
      externalId
    );
    res.status(200).json(details);
  } catch (error) {
    // Map custom, expected service errors (404)
    if (error instanceof MediaNotFoundError) {
      res.status(404).json({ message: error.message });
    }
    // Catch all other unexpected errors (API failures, Redis issues, 500)
    else {
      const err = error as Error;
      console.error(
        `Error aggregating media details for ${mediaType}:${externalId}:`,
        err.message
      );
      res.status(500).json({
        message: "Internal server error: Data aggregation failed.",
      });
    }
  }
};
export const searchMediaController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { query, type } = req.query;
  if (!query) {
    res.status(400).json({ message: "Missing 'query' query parameter." });
    return;
  }

  const mediaType = type!.toString().toUpperCase() as MediaType;
  const searchQuery = query.toString();

  try {
    const results: SearchResult[] = await mediaService.searchMedia(
      mediaType,
      searchQuery
    );
    res.status(200).json(results);
  } catch (error) {
    if (error instanceof MediaNotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      const err = error as Error;
      console.error(
        `Error searching media for ${mediaType} with query "${searchQuery}":`,
        err.message
      );
      res.status(500).json({
        message: "Internal server error: Search operation failed.",
      });
    }
  }
};
