import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/lib/auth/password";
import { createSession, rotateSession, revokeAllSessions } from "@/lib/auth/session";
import { createOTP, verifyOTP } from "@/lib/auth/otp";
import { createSignupToken, verifySignupToken } from "@/lib/auth/jwt";
import { sendOTPEmail } from "@/lib/email/resend";
import type { AuthTokens } from "@/types";

/**
 * Auth Service — orchestrates the full authentication flow.
 * All business logic for signup, login, OTP, password reset lives here.
 */

// ---- SIGNUP FLOW ----

/**
 * Step 1: User submits email → send OTP.
 */
export async function initiateSignup(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  // Generate and send OTP
  const otp = await createOTP(normalizedEmail, "signup");
  const emailResult = await sendOTPEmail(normalizedEmail, otp, "signup");

  if (!emailResult.success) {
    console.warn(
      `⚠️ [RESEND NOTICE] Email to ${normalizedEmail} could not be delivered via Resend API (${emailResult.error}). Created fallback OTP: ${otp}`
    );
  }

  return { success: true };
}

/**
 * Step 2: User submits OTP → verify, return signup token.
 */
export async function verifySignupOTP(
  email: string,
  otp: string
): Promise<{ success: boolean; signupToken?: string; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  const result = await verifyOTP(normalizedEmail, otp, "signup");
  if (!result.valid) {
    return { success: false, error: result.error };
  }

  // Issue a short-lived signup token (10 min)
  const signupToken = await createSignupToken(normalizedEmail);
  return { success: true, signupToken };
}

/**
 * Step 3: User sets password with signup token → create account + session.
 */
export async function completeSignup(
  signupToken: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ success: boolean; tokens?: AuthTokens; error?: string }> {
  // Verify the signup token
  const tokenPayload = await verifySignupToken(signupToken);
  if (!tokenPayload) {
    return { success: false, error: "Invalid or expired signup token" };
  }

  // Validate password strength
  const strengthCheck = validatePasswordStrength(password);
  if (!strengthCheck.valid) {
    return { success: false, error: strengthCheck.errors.join(". ") };
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);

  try {
    const [newUser] = await db
      .insert(users)
      .values({
        email: tokenPayload.email,
        passwordHash,
        emailVerified: true, // Verified via OTP
        role: "user",
      })
      .returning({ id: users.id, email: users.email, role: users.role });

    // Create session
    const tokens = await createSession(
      newUser.id,
      newUser.email,
      newUser.role,
      userAgent,
      ipAddress
    );

    return { success: true, tokens };
  } catch (err: unknown) {
    // Handle unique constraint violation (race condition)
    if (
      err instanceof Error &&
      err.message.includes("unique")
    ) {
      return { success: false, error: "An account with this email already exists" };
    }
    throw err;
  }
}

// ---- LOGIN FLOW ----

/**
 * Email + password login.
 */
export async function login(
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ success: boolean; tokens?: AuthTokens; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    // Don't reveal whether the email exists
    return { success: false, error: "Invalid email or password" };
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    return { success: false, error: "Invalid email or password" };
  }

  const tokens = await createSession(
    user.id,
    user.email,
    user.role,
    userAgent,
    ipAddress
  );

  return { success: true, tokens };
}

// ---- FORGOT PASSWORD FLOW ----

/**
 * Step 1: Request password reset OTP.
 */
export async function initiatePasswordReset(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  // Always return success to not reveal email existence
  if (!user) {
    return { success: true };
  }

  const otp = await createOTP(normalizedEmail, "password_reset");
  await sendOTPEmail(normalizedEmail, otp, "password_reset");

  return { success: true };
}

/**
 * Step 2: Verify OTP + set new password.
 */
export async function resetPassword(
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Verify OTP first
  const otpResult = await verifyOTP(normalizedEmail, otp, "password_reset");
  if (!otpResult.valid) {
    return { success: false, error: otpResult.error };
  }

  // Validate password strength
  const strengthCheck = validatePasswordStrength(newPassword);
  if (!strengthCheck.valid) {
    return { success: false, error: strengthCheck.errors.join(". ") };
  }

  // Update password
  const passwordHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.email, normalizedEmail));

  // Revoke all existing sessions (force re-login)
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (user) {
    await revokeAllSessions(user.id);
  }

  return { success: true };
}

// ---- SESSION REFRESH ----

/**
 * Rotate refresh token.
 */
export async function refreshSession(
  refreshTokenJWT: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ success: boolean; tokens?: AuthTokens; error?: string }> {
  const tokens = await rotateSession(refreshTokenJWT, userAgent, ipAddress);

  if (!tokens) {
    return { success: false, error: "Invalid or expired session" };
  }

  return { success: true, tokens };
}
