// ============================================
// RESTAUS - Authentication Middleware
// ============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth token from cookies or headers
    const authToken = request.cookies.get('restaus_auth_token')?.value;

    // Public paths that don't require authentication
    const publicPaths = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // If accessing public path, allow
    if (isPublicPath) {
        // If already authenticated and trying to access login, redirect to dashboard
        if (authToken && pathname === '/login') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.next();
    }

    // If not authenticated and trying to access protected route, redirect to login
    if (!authToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // TODO: Add role-based access control here
    // For now, just allow authenticated users to access all routes

    return NextResponse.next();
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
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};
