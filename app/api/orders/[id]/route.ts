// ============================================
// RESTAUS - Single Order API Route
// ============================================

import { NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { successResponse, notFoundResponse, handleApiError } from '@/lib/api-response';
import { Order } from '@/types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single order
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);

        const order = await queryOne<Order>(`
      SELECT 
        o.*,
        t.table_number,
        u.full_name as waiter_name
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [orderId]);

        if (!order) {
            return notFoundResponse('Order');
        }

        // Get order items
        const items = await query<any[]>(`
      SELECT 
        oi.*,
        m.name as menu_name,
        m.image_url as menu_image
      FROM order_items oi
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE oi.order_id = ?
    `, [orderId]);

        (order as any).items = items;

        return successResponse(order);
    } catch (error) {
        return handleApiError(error);
    }
}
