// ============================================
// RESTAUS - Order Item Status Update API Route
// ============================================

import { NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { successResponse, errorResponse, notFoundResponse, handleApiError } from '@/lib/api-response';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// PATCH update order item status
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        const itemId = parseInt(id);
        const body = await request.json();
        const { status } = body;

        // Validation
        const validStatuses = ['pending', 'cooking', 'served'];
        if (!status || !validStatuses.includes(status)) {
            return errorResponse('Invalid status', 400);
        }

        // Check if item exists
        const item = await queryOne<any>(
            'SELECT * FROM order_items WHERE id = ?',
            [itemId]
        );

        if (!item) {
            return notFoundResponse('Order item');
        }

        // Update item status
        await query(
            'UPDATE order_items SET status = ? WHERE id = ?',
            [status, itemId]
        );

        // Check if all items in the order are served
        const allItems = await query<any[]>(
            'SELECT status FROM order_items WHERE order_id = ?',
            [item.order_id]
        );

        const allServed = allItems.every(i => i.status === 'served');

        // If all items are served, update order status to delivered
        if (allServed) {
            await query(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['delivered', item.order_id]
            );
        }

        const updatedItem = await queryOne<any>(`
      SELECT 
        oi.*,
        m.name as menu_name
      FROM order_items oi
      LEFT JOIN menus m ON oi.menu_id = m.id
      WHERE oi.id = ?
    `, [itemId]);

        return successResponse(updatedItem, 'Item status updated');
    } catch (error) {
        return handleApiError(error);
    }
}
