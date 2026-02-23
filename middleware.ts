// ============================================
// RESTAUS - Authentication Middleware
// ============================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Get auth token from cookies or headers
  const authToken = request.cookies.get("restaus_auth_token")?.value;

  // Public paths that don't require authentication
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Create response with CORS headers
  let response: NextResponse;

  // If accessing public path, allow
  if (isPublicPath) {
    // If already authenticated and trying to access login, redirect to dashboard
    if (authToken && pathname === "/login") {
      response = NextResponse.redirect(new URL("/admin", request.url));
    } else {
      response = NextResponse.next();
    }
  }
  // If not authenticated and trying to access protected route, redirect to login
  else if (!authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    response = NextResponse.redirect(loginUrl);
  }
  // TODO: Add role-based access control here
  // For now, just allow authenticated users to access all routes
  else {
    response = NextResponse.next();
  }

  // Add CORS headers to all responses
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
