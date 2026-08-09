import { defineConfig } from "drizzle-kit";

// Safely load .env.local if present in development
if (typeof process !== "undefined" && !process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config({ path: ".env.local" });
  } catch {
    // Ignore in production environments where process.env is set by host
  }
}

export default defineConfig({
  out: "./src/lib/db/migrations",
  schema: "./src/lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
