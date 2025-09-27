// src/controllers/mediaController.ts

import { Request, Response } from "express";
import * as mediaService from "../services/mediaService";
import { MediaType } from "../types/media";

export const getMediaDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { type, id } = req.query;

  if (!type || !id) {
    res.status(400).json({ message: "Missing type or id query parameter." });
    return;
  }

  const mediaType = type.toString().toUpperCase() as MediaType;
  const externalId = id.toString();

  try {
    const details = await mediaService.getAggregatedDetails(
      mediaType,
      externalId
    );
    res.status(200).json(details);
  } catch (error) {
    if (error.message.includes("not found")) {
      res.status(404).json({ message: "Media item not found." });
    } else {
      res
        .status(500)
        .json({ message: "Internal server error during data aggregation." });
    }
  }
};

// ... add searchMediaController here
