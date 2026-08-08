import crypto from "crypto";
import { db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { hashPassword, verifyPassword } from "./password";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "./jwt";
import type { AuthTokens } from "@/types";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Generate a cryptographically secure refresh token string.
 */
function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("base64url");
}

/**
 * Create a new session for a user. Returns access + refresh tokens.
 */
export async function createSession(
  userId: string,
  email: string,
  role: "user" | "admin",
  userAgent?: string,
  ipAddress?: string
): Promise<AuthTokens> {
  const refreshTokenRaw = generateRefreshToken();
  const refreshTokenHash = await hashPassword(refreshTokenRaw);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  const [session] = await db
    .insert(sessions)
    .values({
      userId,
      refreshTokenHash,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      expiresAt,
    })
    .returning({ id: sessions.id });

  const accessToken = await createAccessToken({ userId, email, role });
  const refreshToken = await createRefreshToken({
    userId,
    sessionId: session.id,
  });

  // We return the raw refresh token in the cookie, but store only the hash.
  // The JWT refresh token contains the session ID to look up the hash.
  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Rotate a refresh token: validate the old one, create a new one.
 * Implements refresh-reuse detection: if a rotated-out token is replayed,
 * the entire session family is revoked.
 */
export async function rotateSession(
  refreshTokenJWT: string,
  userAgent?: string,
  ipAddress?: string
): Promise<AuthTokens | null> {
  const payload = await verifyRefreshToken(refreshTokenJWT);
  if (!payload || !payload.sub || !payload.sid) return null;

  const userId = payload.sub as string;
  const sessionId = payload.sid as string;

  // Find the session
  const [session] = await db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.id, sessionId),
        eq(sessions.userId, userId),
        isNull(sessions.revokedAt)
      )
    )
    .limit(1);

  if (!session) {
    // Session not found or already revoked — potential token reuse!
    // Revoke ALL sessions for this user as a safety measure.
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.userId, userId));
    return null;
  }

  // Check expiry
  if (new Date() > session.expiresAt) {
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.id, sessionId));
    return null;
  }

  // Revoke the old session
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.id, sessionId));

  // Look up user for token creation
  const { users } = await import("@/lib/db/schema");
  const [user] = await db
    .select({ email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  // Create new session
  return createSession(userId, user.email, user.role, userAgent, ipAddress);
}

/**
 * Revoke a specific session (logout).
 */
export async function revokeSession(sessionId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.id, sessionId));
}

/**
 * Revoke all sessions for a user (e.g., on password change).
 */
export async function revokeAllSessions(userId: string): Promise<void> {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.userId, userId));
}
