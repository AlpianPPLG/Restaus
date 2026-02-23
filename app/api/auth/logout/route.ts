// ============================================
// RESTAUS - Logout API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { successResponse } from "@/lib/api-response";

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
  // In a real application, you would invalidate the session/token here
  // For now, just return success
  const response = successResponse(
    null,
    "Logged out successfully",
    200,
    corsHeaders,
  );
  response.cookies.delete("restaus_auth_token");
  return response;
}
