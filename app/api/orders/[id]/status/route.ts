// ============================================
// RESTAUS - Order Status Update API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { query, queryOne, transaction } from "@/lib/db";
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

// PATCH update order status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    // Validation
    const validStatuses = [
      "pending",
      "processing",
      "delivered",
      "completed",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return errorResponse("Invalid status", 400, corsHeaders);
    }

    // Get current order
    const order = await queryOne<any>("SELECT * FROM orders WHERE id = ?", [
      orderId,
    ]);

    if (!order) {
      return notFoundResponse("Order", corsHeaders);
    }

    // Use transaction for status update
    const result = await transaction(async (conn) => {
      // Update order status
      await conn.execute("UPDATE orders SET status = ? WHERE id = ?", [
        status,
        orderId,
      ]);

      // If status is completed, update table status to available
      if (status === "completed" && order.table_id) {
        await conn.execute("UPDATE tables SET status = ? WHERE id = ?", [
          "available",
          order.table_id,
        ]);
      }

      // If status is delivered, update all items to served
      if (status === "delivered") {
        await conn.execute(
          "UPDATE order_items SET status = ? WHERE order_id = ?",
          ["served", orderId],
        );
      }

      // Get updated order
      const [orders] = await conn.execute<any[]>(
        `
        SELECT 
          o.*,
          t.table_number,
          u.full_name as waiter_name
        FROM orders o
        LEFT JOIN tables t ON o.table_id = t.id
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `,
        [orderId],
      );

      return orders[0];
    });

    return successResponse(result, "Order status updated", 200, corsHeaders);
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}
