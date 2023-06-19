import path from "path";
import parseFileName from "./parseFileName";
import { env } from "../../env";

export default (file: Express.Multer.File, randomId: string, type: string) => {
  const { base, ext } = parseFileName(file.originalname);

  const fullFilePath = path.join(
    env.ROOT_DIR,
    "uploads",
    randomId,
    `full${ext}`
  );
  const newFilePath = path.join(
    env.ROOT_DIR,
    "uploads",
    randomId,
    `${type}${ext}`
  );

  return {
    fullFilePath,
    newFilePath,
    ext,
  };
};
