import app from "./app";
import { env } from "./env";
import Logger from "./utils/logger";

const port = env.PORT || 3007;

app.listen(port, () => {
  Logger.info(`server running on port ${port}`);
});
