import sharp from "sharp";
import { MediaType } from "../../types/MediaType";
import Logger from "../logger";

export default async (
  inputPath: string,
  outputPath: string,
  quality: number,
  MediaType: MediaType
) => {
  try {
    const sharpInstance = sharp(inputPath);
    if (MediaType === ".png") {
      sharpInstance.png({ quality: quality });
    }
    if (MediaType === ".jpg" || MediaType === ".jpeg") {
      sharpInstance.jpeg({ quality: quality });
    }
    if (MediaType === ".webp") {
      sharpInstance.webp({ quality: quality });
    }
    if (MediaType === ".gif") {
      sharpInstance.gif();
    }

    await sharpInstance.toFile(outputPath);
  } catch (error) {
    Logger.error(error);
  }
};
