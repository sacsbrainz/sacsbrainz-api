import morgan, { StreamOptions } from "morgan";
import Logger from "../utils/logger";
import { env } from "../env";

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};
const skip = () => {
  return env.NODE_ENV !== "development";
};

export const morganMiddleware = morgan("short", { stream, skip });
