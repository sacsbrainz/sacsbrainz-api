import express, { Request, Response } from "express";
import { healthRoutes, imageRoutes } from "./routes";
import { rateLimiterUsingThirdParty } from "./middlewares/rateLimiter.middleware";
import { morganMiddleware } from "./middlewares/morgan.middleware";

class App {
  public server: express.Application;

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(morganMiddleware);
    this.server.use(rateLimiterUsingThirdParty);
  }

  routes() {
    this.server.get("", async (req: Request, res: Response) => {
      return res.status(200).json({
        status: 200,
        message: "Welcome! This is the root of the API.",
      });
    });
    this.server.use("/health", healthRoutes);
    this.server.use("/image", imageRoutes);
  }
}

export default new App().server;
