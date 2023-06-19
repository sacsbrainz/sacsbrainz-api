import winston from "winston";
import { env } from "../env";
import path from "path";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const isDevelopment = env.NODE_ENV === "development";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path.join(env.ROOT_DIR, "logs", "error.log"),
    level: "error",
  }),
  new winston.transports.File({
    filename: path.join(env.ROOT_DIR, "logs", "all.log"),
  }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
