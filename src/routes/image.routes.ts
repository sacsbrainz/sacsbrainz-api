import { Router } from "express";
import {
  imageController,
  multerStorage,
} from "../controllers/image.controller";
import multer from "multer";
import checkFileValid from "../middlewares/checkfilevalid.middleware";

const routes = Router();

const upload = multer({
  storage: multerStorage,
});

routes.post("/", upload.single("file"), checkFileValid, imageController.index);
routes.post(
  "/resize",
  upload.single("file"),
  checkFileValid,
  imageController.resize
);
routes.post(
  "/removebg",
  upload.single("file"),
  checkFileValid,
  imageController.removeBg
);
routes.get("/:filename", imageController.getFile);

export default routes;
