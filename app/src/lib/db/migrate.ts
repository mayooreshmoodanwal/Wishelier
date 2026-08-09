import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

if (typeof process !== "undefined" && !process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config({ path: ".env.local" });
  } catch {
    // Ignore in production
  }
}

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log("⚡ Executing database migration SQL on Neon...");

  const migrationPath = path.join(
    process.cwd(),
    "src/lib/db/migrations/0000_peaceful_exodus.sql"
  );

  const sqlContent = fs.readFileSync(migrationPath, "utf-8");

  const statements = sqlContent
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await sql.query(statement);
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        (err.message.includes("already exists") || err.message.includes("duplicate"))
      ) {
        continue;
      }
      console.error("Migration statement error:", err);
    }
  }

  console.log("✅ Migration complete!");
}

runMigrations().catch(console.error);
