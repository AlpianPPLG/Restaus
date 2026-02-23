// ============================================
// RESTAUS - Tables API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";
import { Table } from "@/types";

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

// GET all tables
export async function GET(request: NextRequest) {
  try {
    const tables = await query<Table[]>(`
      SELECT 
        t.*,
        o.id as current_order_id,
        o.status as order_status,
        o.created_at as order_created_at,
        CASE 
          WHEN o.status = 'delivered' 
            AND TIMESTAMPDIFF(MINUTE, o.updated_at, NOW()) > 5 
          THEN 1 
          ELSE 0 
        END as warning
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id 
        AND o.status IN ('pending', 'processing', 'delivered')
      ORDER BY t.table_number
    `);

    return successResponse(tables, undefined, 200, corsHeaders);
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}

// POST create new table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { table_number, capacity } = body;

    // Validation
    if (!table_number || !capacity) {
      return errorResponse(
        "Table number and capacity are required",
        400,
        corsHeaders,
      );
    }

    if (capacity < 1) {
      return errorResponse("Capacity must be at least 1", 400, corsHeaders);
    }

    // Check if table number already exists
    const existing = await query<any[]>(
      "SELECT id FROM tables WHERE table_number = ?",
      [table_number],
    );

    if (existing.length > 0) {
      return errorResponse("Table number already exists", 400, corsHeaders);
    }

    // Insert new table
    const result = await query<any>(
      "INSERT INTO tables (table_number, capacity, status) VALUES (?, ?, ?)",
      [table_number, capacity, "available"],
    );

    const newTable = await query<Table[]>("SELECT * FROM tables WHERE id = ?", [
      result.insertId,
    ]);

    return successResponse(
      newTable[0],
      "Table created successfully",
      201,
      corsHeaders,
    );
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}
