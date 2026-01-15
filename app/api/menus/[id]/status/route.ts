// ============================================
// RESTAUS - Menu Status Update API Route
// ============================================

import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const menuId = parseInt(id);
        const body = await request.json();
        const { is_active } = body;

        // Validation
        if (typeof is_active !== 'boolean') {
            return errorResponse('is_active must be a boolean', 400);
        }

        // Update menu status
        await query(
            'UPDATE menus SET is_active = ? WHERE id = ?',
            [is_active, menuId]
        );

        // Fetch updated menu
        const updatedMenu = await query(
            `SELECT m.*, c.name as category_name 
             FROM menus m 
             LEFT JOIN categories c ON m.category_id = c.id 
             WHERE m.id = ?`,
            [menuId]
        );

        if (!updatedMenu || updatedMenu.length === 0) {
            return errorResponse('Menu not found', 404);
        }

        return successResponse(updatedMenu[0], 'Menu status updated successfully');
    } catch (error) {
        return handleApiError(error);
    }
}
