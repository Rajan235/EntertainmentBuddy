// src/config/redisClient.ts

import { createClient, RedisClientType } from "redis";
import "dotenv/config"; // Ensure environment variables are loaded

// Define the type for the client explicitly
const redisClient: RedisClientType = createClient({
  // Use the REDIS_URL environment variable if set, otherwise default to localhost
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  // CRITICAL: Log connection errors without crashing the app
  console.error("⚠️ Redis Client Error:", err);
});

// Immediately connect the client upon import
redisClient
  .connect()
  .then(() => {
    console.log("✅ Connected to Redis successfully");
  })
  .catch((err) => {
    // Log a fatal error if the initial connection fails
    console.error(
      "❌ FATAL: Redis connection failed on startup. Caching disabled.",
      err
    );
  });

// Export the connected client instance
export default redisClient;
