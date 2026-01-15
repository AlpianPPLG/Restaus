// ============================================
// RESTAUS - User Management API Route
// ============================================

import { NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

// DELETE user
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const userId = parseInt(id);

        // Check if user exists
        const user = await queryOne('SELECT id, role FROM users WHERE id = ?', [userId]);
        if (!user) {
            return errorResponse('User not found', 404);
        }

        // Prevent deleting the last admin if necessary, but for now just basic delete
        // (Optional: Check if user has active orders/transactions linked to them)

        await query('DELETE FROM users WHERE id = ?', [userId]);

        return successResponse(null, 'User deleted successfully');
    } catch (error) {
        return handleApiError(error);
    }
}
