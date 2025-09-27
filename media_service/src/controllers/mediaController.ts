// src/controllers/mediaController.ts

import { Request, Response, NextFunction } from "express";
import * as mediaService from "../services/mediaService";
import { MediaType } from "../types/media";
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

export const getMediaDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { type, id } = req.query;

  if (!type || !id) {
    res.status(400).json({ message: "Missing type or id query parameter." });
    return;
  }

  const mediaTypeStr = type.toString().toUpperCase();
  const externalId = id.toString();

  // 2. STRICT TYPE VALIDATION
  if (!isValidMediaType(mediaTypeStr)) {
    res.status(400).json({
      message: `Invalid media type: ${mediaTypeStr}. Must be one of: ${VALID_MEDIA_TYPES.join(
        ", "
      )}.`,
    });
    return;
  }
  const mediaType = mediaTypeStr as MediaType;

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
      // Log the full error on the server for debugging
      console.error(
        `Error aggregating media details for ${mediaType}:${externalId}:`,
        error
      );

      res.status(500).json({
        message: "Internal server error: Data aggregation failed.",
      });
    }
  }
};

// ... add searchMediaController here
export const searchMediaController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { query, type } = req.query;
  if (!query) {
    res.status(400).json({ message: "Missing query parameter." });
    return;
  }
  if (!type) {
    res.status(400).json({ message: "Missing type parameter." });
    return;
  }

  const mediaTypeStr = type.toString().toUpperCase();
  if (!isValidMediaType(mediaTypeStr)) {
    res.status(400).json({
      message: `Invalid media type: ${mediaTypeStr}. Must be one of: ${VALID_MEDIA_TYPES.join(
        ", "
      )}.`,
    });
    return;
  }
  const mediaType = mediaTypeStr as MediaType;
  const searchQuery = query.toString();

  try {
    const results = await mediaService.searchMedia(mediaType, searchQuery);
    res.status(200).json(results);
  } catch (error) {
    // Map custom, expected service errors (404)
    if (error instanceof MediaNotFoundError) {
      res.status(404).json({ message: error.message });
    }
    // Catch all other unexpected errors (API failures, Redis issues, 500)
    else {
      // Log the full error on the server for debugging
      console.error(
        `Error searching media for ${mediaType} with query "${searchQuery}":`,
        error
      );
      res.status(500).json({
        message: "Internal server error: Search operation failed.",
      });
    }
  }
};
