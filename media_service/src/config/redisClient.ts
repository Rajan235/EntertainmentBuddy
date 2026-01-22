import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// 1. Create the client but DO NOT connect yet
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    // Reconnect Strategy: Retry every 5 seconds, up to 10 times
    reconnectStrategy: (retries) => {
      if (retries > 10) return new Error("Redis connection retries exhausted");
      return 5000;
    },
  },
});

redisClient.on("error", (err) => {
  console.error("⚠️ Redis Client Error:", err);
});

// 2. Export a startup function
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis successfully");
  } catch (err) {
    console.error("❌ Redis Connection Failed:", err);
    // In K8s/Docker, if Redis fails, we often want the container to crash
    // so the orchestrator can restart it.
    process.exit(1);
  }
};

// 3. Export a shutdown function (Critical for Graceful Shutdowns)
export const disconnectRedis = async () => {
  await redisClient.quit();
  console.log("🛑 Redis Client Disconnected");
};

// 4. Export the client for use in other files
export default redisClient;
