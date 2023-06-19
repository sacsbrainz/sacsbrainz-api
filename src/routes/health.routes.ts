import { Router } from "express";
import { healthController } from "../controllers/health.controller";

const routes = Router();

routes.get("/", healthController.index);

export default routes;
