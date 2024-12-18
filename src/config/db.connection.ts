import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const dbConnection = async (
  destinationDb: string
): Promise<typeof mongoose | undefined> => {
  try {
    logger.info(`Start Connecting to Database ${destinationDb}`);
    const connection = mongoose.connect(destinationDb);
    logger.info("Database Connected");

    return connection;
  } catch (error) {
    logger.error(error);
  }
};
