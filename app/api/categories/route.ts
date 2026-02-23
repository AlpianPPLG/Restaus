// ============================================
// RESTAUS - Categories API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { successResponse, handleApiError } from "@/lib/api-response";
import { Category } from "@/types";

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

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await query<Category[]>(`
      SELECT * FROM categories
      ORDER BY sort_order, name
    `);

    return successResponse(categories, undefined, 200, corsHeaders);
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}
