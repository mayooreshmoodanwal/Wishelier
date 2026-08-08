import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type TokenPayload } from "@/lib/auth/jwt";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/create", "/checkout"];
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes — they handle their own auth
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if route requires auth
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Get access token from cookie
  const accessToken = request.cookies.get("access_token")?.value;

  if (isProtected) {
    if (!accessToken) {
      // Redirect to login with return URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAuthRoute && accessToken) {
    // Already logged in — redirect to dashboard
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and api
    "/((?!_next/static|_next/image|favicon.ico|public|s/).*)",
  ],
};
