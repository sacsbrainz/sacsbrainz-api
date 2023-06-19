import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  /*
   * Specify what prefix the client-side variables must have.
   * This is enforced both on type-level and at runtime.
   */
  clientPrefix: "PUBLIC_",
  server: {
    DATABASE_URL: z.string().url(),
    APP_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    ROOT_DIR: z.string().min(1),
    PORT: z.string().min(1),
   },
  client: {
    // PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  },
  /**
   * What object holds the environment variables at runtime.
   * Often `process.env` or `import.meta.env`
   */
  runtimeEnvStrict: {
    DATABASE_URL: process.env.DATABASE_URL,
    APP_URL: process.env.APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    ROOT_DIR: process.env.ROOT_DIR,
    PORT: process.env.PORT,
  },
});
