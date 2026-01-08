// ============================================
// RESTAUS - Orders API Route
// ============================================

import { NextRequest } from 'next/server';
import { query, transaction } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { Order, OrderFormData } from '@/types';

// GET all orders with filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const order_type = searchParams.get('order_type');
        const table_id = searchParams.get('table_id');
        const date_from = searchParams.get('date_from');
        const date_to = searchParams.get('date_to');

        let sql = `
      SELECT 
        o.*,
        t.table_number,
        u.full_name as waiter_name
      FROM orders o
      LEFT JOIN tables t ON o.table_id = t.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
        const params: any[] = [];

        if (status) {
            sql += ' AND o.status = ?';
            params.push(status);
        }

        if (order_type) {
            sql += ' AND o.order_type = ?';
            params.push(order_type);
        }

        if (table_id) {
            sql += ' AND o.table_id = ?';
            params.push(parseInt(table_id));
        }

        if (date_from) {
            sql += ' AND DATE(o.created_at) >= ?';
            params.push(date_from);
        }

        if (date_to) {
            sql += ' AND DATE(o.created_at) <= ?';
            params.push(date_to);
        }

        sql += ' ORDER BY o.created_at DESC';

        const orders = await query<Order[]>(sql, params);

        // Get order items for each order
        for (const order of orders) {
            const items = await query<any[]>(`
        SELECT 
          oi.*,
          m.name as menu_name,
          m.image_url as menu_image
        FROM order_items oi
        LEFT JOIN menus m ON oi.menu_id = m.id
        WHERE oi.order_id = ?
      `, [order.id]);

            (order as any).items = items;
        }

        return successResponse(orders);
    } catch (error) {
        return handleApiError(error);
    }
}

// POST create new order
export async function POST(request: NextRequest) {
    try {
        const body: OrderFormData = await request.json();
        const { table_id, customer_name, order_type, items } = body;

        // Validation
        if (!items || items.length === 0) {
            return errorResponse('Order must have at least one item', 400);
        }

        if (order_type === 'dine_in' && !table_id) {
            return errorResponse('Table is required for dine-in orders', 400);
        }

        // Get user_id from session (for now, use a default value)
        // TODO: Get from authenticated session
        const user_id = 1;

        // Use transaction to create order and items
        const result = await transaction(async (conn) => {
            // Check stock availability for all items
            for (const item of items) {
                const [inventory] = await conn.execute<any[]>(
                    'SELECT remaining_stock FROM inventories WHERE menu_id = ?',
                    [item.menu_id]
                );

                if (!inventory[0] || inventory[0].remaining_stock < item.quantity) {
                    throw new Error(`Insufficient stock for menu item ${item.menu_id}`);
                }
            }

            // Calculate total amount
            let total_amount = 0;
            const itemsWithPrices = [];

            for (const item of items) {
                const [menu] = await conn.execute<any[]>(
                    'SELECT price FROM menus WHERE id = ?',
                    [item.menu_id]
                );

                if (!menu[0]) {
                    throw new Error(`Menu item ${item.menu_id} not found`);
                }

                const price = menu[0].price;
                const subtotal = price * item.quantity;
                total_amount += subtotal;

                itemsWithPrices.push({
                    ...item,
                    price_at_time: price,
                    subtotal,
                });
            }

            // Create order
            const [orderResult] = await conn.execute(
                `INSERT INTO orders 
        (table_id, user_id, customer_name, order_type, status, total_amount) 
        VALUES (?, ?, ?, ?, ?, ?)`,
                [table_id || null, user_id, customer_name || null, order_type, 'pending', total_amount]
            );

            const orderId = (orderResult as any).insertId;

            // Create order items and update inventory
            for (const item of itemsWithPrices) {
                // Insert order item
                await conn.execute(
                    `INSERT INTO order_items 
          (order_id, menu_id, quantity, price_at_time, special_notes, status) 
          VALUES (?, ?, ?, ?, ?, ?)`,
                    [orderId, item.menu_id, item.quantity, item.price_at_time, item.special_notes || null, 'pending']
                );

                // Update inventory (reduce stock)
                await conn.execute(
                    'UPDATE inventories SET remaining_stock = remaining_stock - ? WHERE menu_id = ?',
                    [item.quantity, item.menu_id]
                );
            }

            // Update table status if dine-in
            if (table_id) {
                await conn.execute(
                    'UPDATE tables SET status = ? WHERE id = ?',
                    ['occupied', table_id]
                );
            }

            // Update order status to processing
            await conn.execute(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['processing', orderId]
            );

            // Get created order with items
            const [orders] = await conn.execute<any[]>(`
        SELECT 
          o.*,
          t.table_number,
          u.full_name as waiter_name
        FROM orders o
        LEFT JOIN tables t ON o.table_id = t.id
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId]);

            const [orderItems] = await conn.execute<any[]>(`
        SELECT 
          oi.*,
          m.name as menu_name
        FROM order_items oi
        LEFT JOIN menus m ON oi.menu_id = m.id
        WHERE oi.order_id = ?
      `, [orderId]);

            const order = orders[0];
            order.items = orderItems;

            return order;
        });

        return successResponse(result, 'Order created successfully', 201);
    } catch (error) {
        return handleApiError(error);
    }
}
