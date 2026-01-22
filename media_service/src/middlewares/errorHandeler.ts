import { Request, Response, NextFunction } from "express";
import { MediaNotFoundError, ExternalApiError } from "../errors/error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. Log the error for the developer (you)
  console.error(`❌ Error: ${err.message}`);

  // 2. Handle Known Errors (Client's fault)
  if (err instanceof MediaNotFoundError) {
    return res.status(404).json({
      error: "Not Found",
      message: err.message,
    });
  }

  // 3. Handle External API Errors (Upstream fault)
  if (err instanceof ExternalApiError) {
    return res.status(502).json({
      error: "Bad Gateway",
      message: "External provider failed to respond.",
    });
  }

  // 4. Handle Unexpected Errors (Server's fault)
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong on our end.",
  });
};
