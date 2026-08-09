import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth/jwt";
import type { ZodSchema } from "zod";

/**
 * Standard API error response.
 */
export function apiError(
  code: string,
  message: string,
  status: number = 400
): NextResponse {
  return NextResponse.json(
    { error: { code, message } },
    { status }
  );
}

/**
 * Standard API success response.
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}

/**
 * Extract and verify auth from request. Returns user payload or null.
 */
export async function getAuthUser(
  request: NextRequest
): Promise<TokenPayload | null> {
  // Check Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifyAccessToken(token);
  }

  // Fall back to cookie
  const cookieToken = request.cookies.get("access_token")?.value;
  if (cookieToken) {
    return verifyAccessToken(cookieToken);
  }

  return null;
}

/**
 * Require authentication — returns user or 401 response.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ user: TokenPayload } | { error: NextResponse }> {
  const user = await getAuthUser(request);
  if (!user) {
    return { error: apiError("UNAUTHORIZED", "Authentication required", 401) };
  }
  return { user };
}

/**
 * Require admin role.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: TokenPayload } | { error: NextResponse }> {
  const result = await requireAuth(request);
  if ("error" in result) return result;

  if (result.user.role !== "admin") {
    return { error: apiError("FORBIDDEN", "Admin access required", 403) };
  }
  return result;
}

/**
 * Parse and validate request body with a Zod schema.
 */
export async function parseBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      return {
        error: apiError("VALIDATION_ERROR", errors, 422),
      };
    }

    return { data: parsed.data };
  } catch {
    return {
      error: apiError("INVALID_JSON", "Request body must be valid JSON", 400),
    };
  }
}

// ============================================================
// Rate Limiting (in-memory for now, Redis in production)
// ============================================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter. For production, use Redis/Upstash.
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

/**
 * Rate limit middleware helper — returns 429 if exceeded.
 */
export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = 10,
  windowMs: number = 60000
): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const { allowed, remaining } = rateLimit(
    `${request.nextUrl.pathname}:${ip}`,
    maxRequests,
    windowMs
  );

  if (!allowed) {
    return apiError("RATE_LIMITED", "Too many requests. Try again later.", 429);
  }

  return null;
}

/**
 * Set auth cookies on a response.
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return response;
}

/**
 * Clear auth cookies (logout).
 */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}
