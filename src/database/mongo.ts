import mongoose from "mongoose";
import { logger } from "#root/logger.js";
import { config } from "#root/config.js";

import User from "#root/database/schemas/user.js";

mongoose.set("strictQuery", true);

export async function initializeMongoose(): Promise<true> {
  try {
    await mongoose.connect(config.MONGO_DB);
    logger.info("Mongoose: Database connection established");
    return true;
  } catch (error) {
    logger.error("Mongoose: Failed to connect to database", error);
    throw new Error("Mongoose: Failed to connect to database");
  }
}

export const schemas = {
  User,
};
