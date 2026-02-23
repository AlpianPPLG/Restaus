// ============================================
// RESTAUS - Order Item Status Update API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH update order item status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const itemId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    // Validation
    const validStatuses = ["pending", "cooking", "served"];
    if (!status || !validStatuses.includes(status)) {
      return errorResponse("Invalid status", 400, corsHeaders);
    }

    // Check if item exists
    const item = await queryOne<any>("SELECT * FROM order_items WHERE id = ?", [
      itemId,
    ]);

    if (!item) {
      return notFoundResponse("Order item", corsHeaders);
    }

    // Update item status
    await query("UPDATE order_items SET status = ? WHERE id = ?", [
      status,
      itemId,
    ]);

    // Check if all items in the order are served
    const allItems = await query<any[]>(
      "SELECT status FROM order_items WHERE order_id = ?",
      [item.order_id],
    );

    const allServed = allItems.every((i) => i.status === "served");

    // If all items are served, update order status to delivered
    if (allServed) {
      await query("UPDATE orders SET status = ? WHERE id = ?", [
        "delivered",
        item.order_id,
      ]);
    }

    const updatedItem = await queryOne<any>(
      `
      SELECT 
        oi.*,
        m.name as menu_name
      FROM order_items oi
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE oi.id = ?
    `,
      [itemId],
    );

    return successResponse(
      updatedItem,
      "Item status updated",
      200,
      corsHeaders,
    );
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}
