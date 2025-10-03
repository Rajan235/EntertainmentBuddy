// The routes file (e.g., src/routes/mediaRoutes.ts or similar)

import { Router, Request, Response } from "express"; // Import Request, Response
import {
  getMediaDetails,
  searchMediaController,
} from "../controllers/mediaController";

const router = Router();

// Route for fetching detailed, aggregated and cached data
router.get("/details", getMediaDetails);

// Route for unified search across all external platforms
router.get("/search", searchMediaController);

// FIX: Define health check endpoint correctly on the router
// Standard practice is /api/health to match microservice convention
router.get("/health", (req: Request, res: Response) => {
  // Added type annotations for clarity
  res.status(200).send("OK"); // Send status 200 explicitly
});
// If the route in the app.js is app.use('/api', router), then this route becomes /api/health

export { router as mediaRoutes };
