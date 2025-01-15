import mongoose from "mongoose";
import { dbConnection } from "./config/db.connection";
import { logger } from "./utils/logger";
import { join, extname } from "path";
import fs from "fs";

const destinationDB: string = "mongodb://10.142.1.29:27017/inventory_esdm";
const inputDirectory: string = join(__dirname, "./db/Backup_SIAP");

const importCollectionsToDb = async (): Promise<void> => {
  const connection: typeof mongoose | undefined = await dbConnection(
    destinationDB
  );

  const files: string[] = fs.readdirSync(inputDirectory);

  for (const file of files) {
    if (extname(file) !== ".json") {
      continue;
    }

    const collectionName: string = file.split(".")[1];
    let data: any[] = JSON.parse(
      fs.readFileSync(join(inputDirectory, file), { encoding: "utf-8" })
    );

    data = data.map((item: any) => {
      const { _id, ...rest } = item;
      return rest;
    });

    const collection = connection?.model(
      collectionName,
      new mongoose.Schema({}, { strict: false, _id: false })
    );

    if (data.length) {
      await collection?.deleteMany({});
    }

    const result = await collection?.insertMany(data);

    console.log(result);

    if (!result) throw new Error(`Failed to import ${collectionName}`);

    logger.info(`Collection ${collectionName} imported`);
  }
};

importCollectionsToDb().catch((err) => {
  logger.error(err.message);
});
