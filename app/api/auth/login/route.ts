// ============================================
// RESTAUS - Login API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";
import { User } from "@/types";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validation
    if (!username || !password) {
      return errorResponse(
        "Username and password are required",
        400,
        corsHeaders,
      );
    }

    // Find user by username
    const user = await queryOne<User>(
      "SELECT id, username, role, full_name, created_at, updated_at FROM users WHERE username = ?",
      [username],
    );

    if (!user) {
      return errorResponse("Invalid username or password", 401, corsHeaders);
    }

    // Get password hash
    const passwordData = await queryOne<{ password_hash: string }>(
      "SELECT password_hash FROM users WHERE id = ?",
      [user.id],
    );

    if (!passwordData) {
      return errorResponse("Invalid username or password", 401, corsHeaders);
    }

    // TODO: In production, use bcrypt to compare passwords
    // For now, simple comparison (NOT SECURE - FOR DEVELOPMENT ONLY)
    if (passwordData.password_hash !== password) {
      return errorResponse("Invalid username or password", 401, corsHeaders);
    }

    // Create session data
    const sessionData = {
      user,
      token: `token_${user.id}_${Date.now()}`, // Simple token for development
    };

    const response = successResponse(
      sessionData,
      "Login successful",
      200,
      corsHeaders,
    );

    // Set auth cookie
    response.cookies.set("restaus_auth_token", sessionData.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}
