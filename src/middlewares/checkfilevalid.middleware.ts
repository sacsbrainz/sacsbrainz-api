import { NextFunction, Request, Response } from "express";
import parseFileName from "../utils/image/parseFileName";
import { MediaType } from "../types/MediaType";

const checkFileValid = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({
      status: 400,
      message: "No file uploaded",
    });
  }
  const { ext } = parseFileName(req.file.filename);
  const mediaTypes = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  const isMediaType = (x: any): x is MediaType => mediaTypes.includes(x);

  if (!isMediaType(ext.toLowerCase())) {
    return res.status(400).json({
      status: 400,
      message: "Only images are supported now",
    });
  }
  next();
};

export default checkFileValid;
