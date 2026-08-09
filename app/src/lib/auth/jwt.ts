import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-me"
);

const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "fallback-refresh-secret-change-me"
);

export interface TokenPayload extends JoseJWTPayload {
  sub: string;
  email: string;
  role: "user" | "admin";
}

/**
 * Create a short-lived access token (15 minutes).
 */
export async function createAccessToken(payload: {
  userId: string;
  email: string;
  role: "user" | "admin";
}): Promise<string> {
  return new SignJWT({
    sub: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setIssuer("wishelier")
    .sign(JWT_SECRET);
}

/**
 * Create a refresh token (30 days).
 */
export async function createRefreshToken(payload: {
  userId: string;
  sessionId: string;
}): Promise<string> {
  return new SignJWT({
    sub: payload.userId,
    sid: payload.sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .setIssuer("wishelier")
    .sign(JWT_REFRESH_SECRET);
}

/**
 * Verify and decode an access token.
 */
export async function verifyAccessToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "wishelier",
    });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verify and decode a refresh token.
 */
export async function verifyRefreshToken(
  token: string
): Promise<JoseJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET, {
      issuer: "wishelier",
    });
    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a short-lived signup token (10 minutes) — used after OTP verification
 * to allow the user to set their password.
 */
export async function createSignupToken(email: string): Promise<string> {
  return new SignJWT({ email, purpose: "signup" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .setIssuer("wishelier")
    .sign(JWT_SECRET);
}

/**
 * Verify a signup token.
 */
export async function verifySignupToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: "wishelier",
    });
    if (payload.purpose !== "signup" || typeof payload.email !== "string") {
      return null;
    }
    return { email: payload.email };
  } catch {
    return null;
  }
}
