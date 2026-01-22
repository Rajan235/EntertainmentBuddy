import dotenv from "dotenv";
//import mongoose from "mongoose";
import { app } from "./app";
import { connectRedis, disconnectRedis } from "./config/redisClient";
dotenv.config();

//import { listenOrderCreated } from "./events/orderCreatedListener";
//import { listenOrderUpdated } from "./events/orderUpdatedListener";
const start = async () => {
  console.log("🚀 Starting Media Service...");

  // 1. Check Essential Env Vars
  // We don't need JWT_KEY here unless you are verifying tokens in this service
  // if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");

  const requiredEnv = [
    "REDIS_URL",
    "TMDB_API_KEY",
    "GOOGLE_BOOKS_API_KEY", // Changed from LASTFM
    "SPOTIFY_CLIENT_ID", // Changed from LASTFM
    "SPOTIFY_CLIENT_SECRET",
    "IGDB_CLIENT_ID",
    "IGDB_CLIENT_SECRET",
  ];

  for (const envName of requiredEnv) {
    if (!process.env[envName]) {
      throw new Error(`❌ FATAL: ${envName} must be defined in .env`);
    }
  }

  // 2. Connect to Infrastructure
  try {
    await connectRedis(); // Fix: Added parenthesis to call the function
  } catch (err) {
    console.error("❌ Failed to connect to Redis", err);
    process.exit(1);
  }

  // 3. Start Server
  const PORT = process.env.PORT || 4000;

  const server = app.listen(PORT, () => {
    console.log(`
      ################################################
      ✅  Media Service listening on port ${PORT}
      🔗  http://localhost:${PORT}/api/media/health
      ################################################
    `);
  });

  // 4. Graceful Shutdown
  const shutdown = async () => {
    console.log("\n🔄 Shutting down gracefully...");
    server.close();
    await disconnectRedis();
    process.exit(0);
  };
  //if (!process.env.MONGO_URI) {
  //throw new Error("MONGO_URI must be defined");
  //}
  //try {
  //await mongoose.connect(process.env.MONGO_URI);
  // console.log("Connected to MongoDb");
  //} catch (err) {
  //console.error(err);
  //}
  //try {
  //await initKafka();
  //consumer.connect();
  //console.log("✅ Kafka Consumer Connected");

  // ✅ Start all listeners
  // await Promise.all([listenOrderCreated(), listenOrderUpdated()]);
  //} catch (error) {
  //console.log(error);
  //}

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start();

//process.on("SIGINT", async () => {
//console.log("🛑 Caught SIGINT. Shutting down gracefully...");
//await producer.disconnect();
//await consumer.disconnect();
//process.exit(0);
//});

//process.on("SIGTERM", async () => {
//console.log("🛑 Caught SIGTERM. Shutting down gracefully...");
//await producer.disconnect();
//await consumer.disconnect();
//process.exit(0);
//});
