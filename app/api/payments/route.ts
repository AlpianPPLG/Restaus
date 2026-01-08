// ============================================
// RESTAUS - Payments API Route
// ============================================

import { NextRequest } from 'next/server';
import { query, queryOne, transaction } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { Payment, PaymentFormData } from '@/types';

// POST process payment
export async function POST(request: NextRequest) {
    try {
        const body: PaymentFormData = await request.json();
        const { order_id, payment_method, amount_paid } = body;

        // Validation
        if (!order_id || !payment_method || amount_paid === undefined) {
            return errorResponse('Order ID, payment method, and amount paid are required', 400);
        }

        // Get order details
        const order = await queryOne<any>(
            'SELECT * FROM orders WHERE id = ?',
            [order_id]
        );

        if (!order) {
            return errorResponse('Order not found', 404);
        }

        if (order.status === 'completed') {
            return errorResponse('Order has already been paid', 400);
        }

        if (order.status !== 'delivered') {
            return errorResponse('Order must be delivered before payment', 400);
        }

        // Calculate change
        const change_amount = amount_paid - order.total_amount;

        if (change_amount < 0) {
            return errorResponse('Insufficient payment amount', 400);
        }

        // Get cashier_id from session (for now, use default)
        // TODO: Get from authenticated session
        const cashier_id = 1;

        // Use transaction to process payment
        const result = await transaction(async (conn) => {
            // Insert payment record
            const [paymentResult] = await conn.execute(
                `INSERT INTO payments 
        (order_id, cashier_id, payment_method, amount_paid, change_amount) 
        VALUES (?, ?, ?, ?, ?)`,
                [order_id, cashier_id, payment_method, amount_paid, change_amount]
            );

            const paymentId = (paymentResult as any).insertId;

            // Update order status to completed
            await conn.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['completed', order_id]
            );

            // Update table status to available if dine-in
            if (order.table_id) {
                await conn.execute(
                    'UPDATE tables SET status = ? WHERE id = ?',
                    ['available', order.table_id]
                );
            }

            // Get payment details
            const [payments] = await conn.execute<any[]>(`
        SELECT 
          p.*,
          o.total_amount as order_total,
          o.table_id,
          t.table_number,
          u.full_name as cashier_name
        FROM payments p
        LEFT JOIN orders o ON p.order_id = o.id
        LEFT JOIN tables t ON o.table_id = t.id
        LEFT JOIN users u ON p.cashier_id = u.id
        WHERE p.id = ?
      `, [paymentId]);

            return payments[0];
        });

        return successResponse(result, 'Payment processed successfully', 201);
    } catch (error) {
        return handleApiError(error);
    }
}

// GET payment history
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const date_from = searchParams.get('date_from');
        const date_to = searchParams.get('date_to');

        let sql = `
      SELECT 
        p.*,
        o.total_amount as order_total,
        o.table_id,
        t.table_number,
        u.full_name as cashier_name
      FROM payments p
      LEFT JOIN orders o ON p.order_id = o.id
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON p.cashier_id = u.id
      WHERE 1=1
    `;
        const params: any[] = [];

        if (date_from) {
            sql += ' AND DATE(p.transaction_date) >= ?';
            params.push(date_from);
        }

        if (date_to) {
            sql += ' AND DATE(p.transaction_date) <= ?';
            params.push(date_to);
        }

        sql += ' ORDER BY p.transaction_date DESC';

        const payments = await query<Payment[]>(sql, params);

        return successResponse(payments);
    } catch (error) {
        return handleApiError(error);
    }
}
