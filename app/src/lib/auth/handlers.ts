import { NextRequest } from "next/server";
import {
  apiSuccess,
  apiError,
  parseBody,
  checkRateLimit,
  setAuthCookies,
} from "@/lib/api-helpers";
import {
  signupSchema,
  verifyOtpSchema,
  setPasswordSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators";
import {
  initiateSignup,
  verifySignupOTP,
  completeSignup,
  login,
  initiatePasswordReset,
  resetPassword,
  refreshSession,
} from "@/lib/services/auth.service";

// ---- POST /api/auth/signup ----
export async function signup(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, 5, 60000);
    if (rateLimited) return rateLimited;

    const parsed = await parseBody(request, signupSchema);
    if ("error" in parsed) return parsed.error;

    const result = await initiateSignup(parsed.data.email);
    if (!result.success) {
      return apiError("SIGNUP_FAILED", result.error!, 409);
    }

    return apiSuccess({ message: "Verification OTP sent to your email" });
  } catch (err: unknown) {
    console.error("Signup handler error:", err);
    return apiError(
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "Signup failed due to server error",
      500
    );
  }
}

// ---- POST /api/auth/verify-otp ----
export async function verifyOtp(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, 10, 60000);
    if (rateLimited) return rateLimited;

    const parsed = await parseBody(request, verifyOtpSchema);
    if ("error" in parsed) return parsed.error;

    if (parsed.data.purpose === "signup") {
      const result = await verifySignupOTP(parsed.data.email, parsed.data.otp);
      if (!result.success) {
        return apiError("OTP_INVALID", result.error!, 401);
      }
      return apiSuccess({ signupToken: result.signupToken });
    }

    return apiError("UNSUPPORTED_PURPOSE", "Use the appropriate endpoint for this OTP purpose", 400);
  } catch (err: unknown) {
    console.error("Verify OTP handler error:", err);
    return apiError(
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "Verification failed due to server error",
      500
    );
  }
}

// ---- POST /api/auth/set-password ----
export async function setPassword(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, 5, 60000);
    if (rateLimited) return rateLimited;

    const parsed = await parseBody(request, setPasswordSchema);
    if ("error" in parsed) return parsed.error;

    const userAgent = request.headers.get("user-agent") || undefined;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    const result = await completeSignup(
      parsed.data.signupToken,
      parsed.data.password,
      userAgent,
      ip
    );

    if (!result.success) {
      return apiError("SIGNUP_FAILED", result.error!, 400);
    }

    const response = apiSuccess({ message: "Account created successfully" }, 201);
    return setAuthCookies(
      response,
      result.tokens!.accessToken,
      result.tokens!.refreshToken
    );
  } catch (err: unknown) {
    console.error("Set password handler error:", err);
    return apiError(
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "Set password failed due to server error",
      500
    );
  }
}

// ---- POST /api/auth/login ----
export async function loginHandler(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, 5, 60000);
    if (rateLimited) return rateLimited;

    const parsed = await parseBody(request, loginSchema);
    if ("error" in parsed) return parsed.error;

    const userAgent = request.headers.get("user-agent") || undefined;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    const result = await login(
      parsed.data.email,
      parsed.data.password,
      userAgent,
      ip
    );

    if (!result.success) {
      return apiError("LOGIN_FAILED", result.error!, 401);
    }

    const response = apiSuccess({ message: "Logged in successfully" });
    return setAuthCookies(
      response,
      result.tokens!.accessToken,
      result.tokens!.refreshToken
    );
  } catch (err: unknown) {
    console.error("Login handler error:", err);
    return apiError(
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "Login failed due to server error",
      500
    );
  }
}

// ---- POST /api/auth/forgot-password ----
export async function forgotPassword(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, 3, 60000);
    if (rateLimited) return rateLimited;

    const parsed = await parseBody(request, forgotPasswordSchema);
    if ("error" in parsed) return parsed.error;

    await initiatePasswordReset(parsed.data.email);
    // Always return success to prevent email enumeration
    return apiSuccess({ message: "If an account exists, a reset code has been sent" });
  } catch (err: unknown) {
    console.error("Forgot password handler error:", err);
    return apiError(
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "Forgot password failed due to server error",
      500
    );
  }
}

// ---- POST /api/auth/reset-password ----
export async function resetPasswordHandler(request: NextRequest) {
  try {
    const rateLimited = checkRateLimit(request, 5, 60000);
    if (rateLimited) return rateLimited;

    const parsed = await parseBody(request, resetPasswordSchema);
    if ("error" in parsed) return parsed.error;

    const result = await resetPassword(
      parsed.data.email,
      parsed.data.otp,
      parsed.data.newPassword
    );

    if (!result.success) {
      return apiError("RESET_FAILED", result.error!, 400);
    }

    return apiSuccess({ message: "Password reset successfully. Please log in." });
  } catch (err: unknown) {
    console.error("Reset password handler error:", err);
    return apiError(
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "Reset password failed due to server error",
      500
    );
  }
}

// ---- POST /api/auth/refresh ----
export async function refresh(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return apiError("NO_REFRESH_TOKEN", "Refresh token not found", 401);
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    const result = await refreshSession(refreshToken, userAgent, ip);
    if (!result.success) {
      return apiError("REFRESH_FAILED", result.error!, 401);
    }

    const response = apiSuccess({ message: "Tokens refreshed" });
    return setAuthCookies(
      response,
      result.tokens!.accessToken,
      result.tokens!.refreshToken
    );
  } catch (err: unknown) {
    console.error("Refresh token handler error:", err);
    return apiError(
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "Token refresh failed due to server error",
      500
    );
  }
}

// ---- POST /api/auth/logout ----
export async function logout() {
  const { clearAuthCookies } = await import("@/lib/api-helpers");
  const { NextResponse } = await import("next/server");
  const response = NextResponse.json(
    { data: { message: "Logged out" } },
    { status: 200 }
  );
  return clearAuthCookies(response);
}
