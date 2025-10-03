import dotenv from "dotenv";
dotenv.config();
//import mongoose from "mongoose";

import { app } from "./app";
//import { listenOrderCreated } from "./events/orderCreatedListener";
//import { listenOrderUpdated } from "./events/orderUpdatedListener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY must be defined");
  }
  if (!process.env.LASTFM_API_KEY) {
    throw new Error("LASTFM_API_KEY must be defined");
  }
  if (!process.env.IGDB_CLIENT_ID) {
    throw new Error("IGDB_CLIENT_ID must be defined");
  }
  if (!process.env.IGDB_CLIENT_SECRET) {
    throw new Error("IGDB_CLIENT_SECRET must be defined");
  }
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

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Media service listening on port ${port}`);
  });
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
