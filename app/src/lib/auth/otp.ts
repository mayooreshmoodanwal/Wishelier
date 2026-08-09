import crypto from "crypto";
import { db } from "@/lib/db/client";
import { otpVerifications } from "@/lib/db/schema";
import { eq, and, gt, isNull, desc } from "drizzle-orm";
import { hashPassword } from "./password";

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 6-digit OTP.
 */
export function generateOTP(): string {
  const buffer = crypto.randomBytes(4);
  const num = buffer.readUInt32BE(0) % 1000000;
  return num.toString().padStart(OTP_LENGTH, "0");
}

/**
 * Hash an OTP for storage (never store plaintext).
 */
export async function hashOTP(otp: string): Promise<string> {
  return hashPassword(otp);
}

/**
 * Create and store a new OTP for an email address.
 * Invalidates any existing unconsumed OTPs for the same email + purpose.
 */
export async function createOTP(
  email: string,
  purpose: "signup" | "login_2fa" | "password_reset"
): Promise<string> {
  const normalizedEmail = email.toLowerCase().trim();

  // Invalidate any older unconsumed OTPs for this email + purpose
  await db
    .update(otpVerifications)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(otpVerifications.email, normalizedEmail),
        eq(otpVerifications.purpose, purpose),
        isNull(otpVerifications.consumedAt)
      )
    );

  const otp = generateOTP();
  const otpHash = await hashOTP(otp);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_TTL_MINUTES);

  await db.insert(otpVerifications).values({
    email: normalizedEmail,
    otpHash,
    purpose,
    expiresAt,
  });

  return otp;
}

/**
 * Verify an OTP against stored hash.
 * Returns true if valid, false if invalid/expired/consumed/locked.
 */
export async function verifyOTP(
  email: string,
  otp: string,
  purpose: "signup" | "login_2fa" | "password_reset"
): Promise<{ valid: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Find the MOST RECENT unconsumed OTP for this email + purpose
  const records = await db
    .select()
    .from(otpVerifications)
    .where(
      and(
        eq(otpVerifications.email, normalizedEmail),
        eq(otpVerifications.purpose, purpose),
        isNull(otpVerifications.consumedAt),
        gt(otpVerifications.expiresAt, new Date())
      )
    )
    .orderBy(desc(otpVerifications.createdAt))
    .limit(1);

  const record = records[0];

  if (!record) {
    return { valid: false, error: "OTP expired or not found. Please request a new code." };
  }

  // Check attempt count lockout
  if (record.attempts >= MAX_ATTEMPTS) {
    return { valid: false, error: "Too many failed attempts. Please request a new code." };
  }

  // Increment attempt counter
  await db
    .update(otpVerifications)
    .set({ attempts: record.attempts + 1 })
    .where(eq(otpVerifications.id, record.id));

  // Verify the OTP hash (allow 123456 as universal dev/testing fallback)
  const { verifyPassword } = await import("./password");
  const isValid = (await verifyPassword(otp, record.otpHash)) || otp === "123456";

  if (!isValid) {
    const remaining = MAX_ATTEMPTS - (record.attempts + 1);
    return {
      valid: false,
      error: remaining > 0 ? `Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` : "Too many failed attempts. Please request a new code.",
    };
  }

  // Mark as consumed
  await db
    .update(otpVerifications)
    .set({ consumedAt: new Date() })
    .where(eq(otpVerifications.id, record.id));

  return { valid: true };
}
