// ============================================
// RESTAUS - Menus API Route
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { query, transaction } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";
import { Menu } from "@/types";

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

// GET all menus with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category_id = searchParams.get("category_id");
    const is_active = searchParams.get("is_active");
    const search = searchParams.get("search");
    const in_stock = searchParams.get("in_stock");

    let sql = `
      SELECT 
        m.*,
        c.name as category_name,
        i.daily_stock,
        i.remaining_stock
      FROM menus m
      LEFT JOIN categories c ON m.category_id = c.id
      LEFT JOIN inventories i ON m.id = i.menu_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category_id) {
      sql += " AND m.category_id = ?";
      params.push(parseInt(category_id));
    }

    if (is_active !== null && is_active !== undefined) {
      sql += " AND m.is_active = ?";
      params.push(is_active === "true" ? 1 : 0);
    }

    if (search) {
      sql += " AND (m.name LIKE ? OR m.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (in_stock === "true") {
      sql += " AND i.remaining_stock > 0";
    }

    sql += " ORDER BY c.sort_order, m.name";

    const menus = await query<Menu[]>(sql, params);

    return successResponse(menus, undefined, 200, corsHeaders);
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}

// POST create new menu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category_id,
      name,
      description,
      price,
      image_url,
      is_active = true,
      daily_stock = 0,
    } = body;

    // Validation
    if (!category_id || !name || price === undefined) {
      return errorResponse(
        "Category, name, and price are required",
        400,
        corsHeaders,
      );
    }

    if (price < 0) {
      return errorResponse("Price must be non-negative", 400, corsHeaders);
    }

    // Use transaction to create menu and inventory
    const result = await transaction(async (conn) => {
      // Insert menu
      const [menuResult] = await conn.execute(
        "INSERT INTO menus (category_id, name, description, price, image_url, is_active) VALUES (?, ?, ?, ?, ?, ?)",
        [
          category_id,
          name,
          description || null,
          price,
          image_url || null,
          is_active ? 1 : 0,
        ],
      );

      const menuId = (menuResult as any).insertId;

      // Insert inventory
      await conn.execute(
        "INSERT INTO inventories (menu_id, daily_stock, remaining_stock) VALUES (?, ?, ?)",
        [menuId, daily_stock, daily_stock],
      );

      // Get created menu with inventory
      const [menus] = await conn.execute<any[]>(
        `
        SELECT 
          m.*,
          i.daily_stock,
          i.remaining_stock
        FROM menus m
        LEFT JOIN inventories i ON m.id = i.menu_id
        WHERE m.id = ?
      `,
        [menuId],
      );

      return menus[0];
    });

    return successResponse(
      result,
      "Menu created successfully",
      201,
      corsHeaders,
    );
  } catch (error) {
    return handleApiError(error, corsHeaders);
  }
}
