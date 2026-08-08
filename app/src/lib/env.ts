import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // ImageKit
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),

  // Cloudflare
  CLOUDFLARE_API_TOKEN: z.string().min(1),
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_PROJECT_NAME: z.string().min(1),

  // Cashfree
  CASHFREE_APP_ID: z.string().min(1),
  CASHFREE_APP_SECRET: z.string().min(1),
  CASHFREE_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),

  // Resend
  RESEND_API_KEY: z.string().min(1),

  // Auth
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z.string().min(16),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default("Wishelier"),
  NEXT_PUBLIC_DOMAIN: z.string().default("wishelier.in"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated env. Call this at startup to catch missing vars early.
 */
export function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables. Check server logs.");
  }

  return parsed.data;
}

/**
 * Get a typed env variable (unchecked — use validateEnv() at startup).
 */
export function env() {
  return process.env as unknown as Env;
}
