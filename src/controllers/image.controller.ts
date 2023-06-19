import { Request, Response } from "express";
import parseFileName from "../utils/image/parseFileName";
import path from "path";
import fs from "fs";
import { MediaType } from "../types/MediaType";
import prepareFileDetails from "../utils/image/prepareFileDetails";
import compressImage from "../utils/image/compressImage";
import { env } from "../env";
import { createId } from "@paralleldrive/cuid2";
import multer from "multer";
import { formatBytes, getFileSize } from "../utils/image";
import sharp from "sharp";
import { Rembg } from "rembg-node";
import Logger from "../utils/logger";

let randomId = createId();

export const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.promises
      .mkdir(path.join(env.ROOT_DIR, "uploads", randomId), { recursive: true })
      .then(() => {
        cb(null, path.join(env.ROOT_DIR, "uploads", randomId));
      });
  },
  filename: (req, file, cb) => {
    cb(null, `full${parseFileName(file.originalname).ext}`);
  },
});

export const imageController = {
  async index(req: Request, res: Response) {
    const { file } = req;
    const { quality } = req.body;

    if (!file)
      return res.status(400).json({
        status: 400,
        message: "Please upload a file",
      });

    const { fullFilePath, newFilePath, ext } = prepareFileDetails(
      file,
      randomId,
      "compressed"
    );

    await compressImage(
      fullFilePath,
      newFilePath,
      quality ? parseInt(quality) : 50,
      ext as MediaType
    );

    randomId = createId();

    return res.status(200).json({
      status: 200,
      message: "Image compressed successfully",
      data: {
        orignal: path.join(
          env.APP_URL,
          "image",
          fullFilePath.split("/uploads/")[1].split("/")[0] + ext
        ),
        compressed: path.join(
          env.APP_URL,
          "image",
          newFilePath.split("/uploads/")[1].split("/")[0] +
            ext +
            "?type=compressed"
        ),
        originalSize: formatBytes(file.size),
        compressedSize: getFileSize(newFilePath),
        reduction: `${100 - (quality ? parseInt(quality) : 50)}%`,
      },
    });
  },

  async resize(req: Request, res: Response) {
    const { file } = req;
    const { height, width } = req.body;

    if (!file)
      return res.status(400).json({
        status: 400,
        message: "Please upload a file",
      });
    if (!height || !width)
      return res.status(400).json({
        status: 400,
        message: "Please provide height and width",
      });

    const { fullFilePath, newFilePath, ext } = prepareFileDetails(
      file,
      randomId,
      "resized"
    );

    await sharp(fullFilePath)
      .resize({
        height: parseInt(height),
        width: parseInt(width),
      })
      .toFile(newFilePath)
      .catch((err) => {
        Logger.error(err);
      });

    randomId = createId();

    return res.status(200).json({
      status: 200,
      message: "Image resized successfully",
      data: {
        orignal: path.join(
          env.APP_URL,
          "image",
          fullFilePath.split("/uploads/")[1].split("/")[0] + ext
        ),
        resized: path.join(
          env.APP_URL,
          "image",
          newFilePath.split("/uploads/")[1].split("/")[0] +
            ext +
            "?type=resized"
        ),
      },
    });
  },

  async removeBg(req: Request, res: Response) {
    const { file } = req;

    if (!file)
      return res.status(400).json({
        status: 400,
        message: "Please upload a file",
      });

    const { fullFilePath, newFilePath, ext } = prepareFileDetails(
      file,
      randomId,
      "removeBg"
    );
    const sharpInstance = sharp(fullFilePath);
    const rembg = new Rembg({
      logging: true,
    });
    const output = await rembg.remove(sharpInstance);

    await output.webp().toFile(newFilePath);

    randomId = createId();

    return res.status(200).json({
      status: 200,
      message: "Image background removed successfully",
      data: {
        orignal: path.join(
          env.APP_URL,
          "image",
          fullFilePath.split("/uploads/")[1].split("/")[0] + ext
        ),
        withoutBackground: path.join(
          env.APP_URL,
          "image",
          newFilePath.split("/uploads/")[1].split("/")[0] +
            ext +
            "?type=removeBg"
        ),
      },
    });
  },

  async getFile(req: Request, res: Response) {
    const { filename } = req.params;
    const { base, ext } = parseFileName(filename);
    const type = !req.query.type ? `full${ext}` : `${req.query.type}${ext}`;
    const filePath = path.join(env.ROOT_DIR, "uploads", base, type);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(400).json({
          status: 400,
          message: "File not found",
        });
      }

      return res.status(200).sendFile(filePath);
    });
  },
};
