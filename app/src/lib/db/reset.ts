import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config({ path: ".env.local" });

async function resetAndMigrate() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env.local");
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log("🔥 Resetting legacy database tables on Neon Postgres...");

  // Drop all known legacy and current tables to ensure clean slate
  const tablesToDrop = [
    "password_reset_otps",
    "site_generations",
    "analytics_daily",
    "share_events",
    "deployments",
    "payments",
    "media",
    "projects",
    "template_versions",
    "templates",
    "otp_verifications",
    "sessions",
    "users",
    "event_types",
  ];

  for (const table of tablesToDrop) {
    try {
      await sql.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      console.log(`  ✓ Dropped table "${table}" (if existed)`);
    } catch (err) {
      console.warn(`  ! Notice dropping table "${table}":`, err);
    }
  }

  // Drop legacy enums if they exist
  const enumsToDrop = [
    "user_role",
    "otp_purpose",
    "media_provider",
    "media_type",
    "moderation_status",
    "project_status",
    "payment_status",
    "deployment_status",
    "pricing_tier",
    "share_channel",
  ];

  for (const enumName of enumsToDrop) {
    try {
      await sql.query(`DROP TYPE IF EXISTS "${enumName}" CASCADE;`);
    } catch {
      // Ignore if enum didn't exist
    }
  }

  console.log("⚡ Applying clean migration SQL (0000_peaceful_exodus.sql)...");

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
    } catch (err) {
      console.error("Migration statement error:", err);
      throw err;
    }
  }

  console.log("✅ Database schema migrated cleanly!");
}

resetAndMigrate().catch((err) => {
  console.error("❌ Reset script failed:", err);
  process.exit(1);
});
