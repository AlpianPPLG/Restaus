// ============================================
// RESTAUS - Users API Route
// ============================================

import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { successResponse, serverErrorResponse } from "@/lib/api-response";
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

export async function GET() {
  try {
    // Fetch users excluding password hash
    const users = await query<User>(
      "SELECT id, username, full_name, role, created_at FROM users ORDER BY created_at DESC",
    );

    return successResponse(users, undefined, 200, corsHeaders);
  } catch (error) {
    console.error("Error fetching users:", error);
    return serverErrorResponse(
      error instanceof Error ? error : undefined,
      corsHeaders,
    );
  }
}
