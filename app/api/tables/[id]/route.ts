// ============================================
// RESTAUS - Single Table API Route
// ============================================

import { NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { successResponse, errorResponse, notFoundResponse, handleApiError } from '@/lib/api-response';
import { Table } from '@/types';

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET single table
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        const tableId = parseInt(id);

        const table = await queryOne<Table>(`
      SELECT 
        t.*,
        o.id as current_order_id,
        o.status as order_status
      FROM tables t
      LEFT JOIN orders o ON t.id = o.table_id 
        AND o.status IN ('pending', 'processing', 'delivered')
      WHERE t.id = ?
    `, [tableId]);

        if (!table) {
            return notFoundResponse('Table');
        }

        return successResponse(table);
    } catch (error) {
        return handleApiError(error);
    }
}

// PATCH update table status
export async function PATCH(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        const tableId = parseInt(id);
        const body = await request.json();
        const { status } = body;

        // Validation
        const validStatuses = ['available', 'reserved', 'occupied'];
        if (!status || !validStatuses.includes(status)) {
            return errorResponse('Invalid status', 400);
        }

        // Update table status
        await query(
            'UPDATE tables SET status = ? WHERE id = ?',
            [status, tableId]
        );

        const updatedTable = await queryOne<Table>(
            'SELECT * FROM tables WHERE id = ?',
            [tableId]
        );

        if (!updatedTable) {
            return notFoundResponse('Table');
        }

        return successResponse(updatedTable, 'Table status updated');
    } catch (error) {
        return handleApiError(error);
    }
}

// PUT update table details
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        const tableId = parseInt(id);
        const body = await request.json();
        const { table_number, capacity } = body;

        // Validation
        if (!table_number || capacity === undefined) {
            return errorResponse('Table number and capacity are required', 400);
        }

        // Update table
        await query(
            'UPDATE tables SET table_number = ?, capacity = ? WHERE id = ?',
            [table_number, capacity, tableId]
        );

        const updatedTable = await queryOne<Table>(
            'SELECT * FROM tables WHERE id = ?',
            [tableId]
        );

        return successResponse(updatedTable, 'Table updated successfully');
    } catch (error) {
        return handleApiError(error);
    }
}

// DELETE table
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params;
        const tableId = parseInt(id);

        // Check if table has active orders
        const activeOrders = await query<any[]>(
            'SELECT id FROM orders WHERE table_id = ? AND status IN (?, ?, ?)',
            [tableId, 'pending', 'processing', 'delivered']
        );

        if (activeOrders.length > 0) {
            return errorResponse('Cannot delete table with active orders', 400);
        }

        await query('DELETE FROM tables WHERE id = ?', [tableId]);

        return successResponse(null, 'Table deleted successfully');
    } catch (error) {
        return handleApiError(error);
    }
}
