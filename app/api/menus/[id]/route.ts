// ============================================
// RESTAUS - Menu Detail API Routes (GET, PUT, DELETE)
// ============================================

import { NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { Menu } from '@/types';

// GET single menu by ID
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const menuId = parseInt(id);

        const menu = await queryOne<Menu>(
            `SELECT m.*, c.name as category_name,
                    i.daily_stock, i.remaining_stock
             FROM menus m
             LEFT JOIN categories c ON m.category_id = c.id
             LEFT JOIN inventories i ON m.id = i.menu_id
             WHERE m.id = ?`,
            [menuId]
        );

        if (!menu) {
            return errorResponse('Menu not found', 404);
        }

        return successResponse(menu);
    } catch (error) {
        return handleApiError(error);
    }
}

// PUT update menu
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const menuId = parseInt(id);
        const body = await request.json();
        const { name, description, price, category_id, image_url, is_active, daily_stock } = body;

        // Validation
        if (!name || !price || !category_id) {
            return errorResponse('Name, price, and category are required', 400);
        }

        // Update menu
        await query(
            `UPDATE menus 
             SET name = ?, description = ?, price = ?, category_id = ?, 
                 image_url = ?, is_active = ?
             WHERE id = ?`,
            [name, description || null, price, category_id, image_url || null, is_active ?? true, menuId]
        );

        // Update inventory if daily_stock is provided
        if (daily_stock !== undefined) {
            // Check if inventory exists
            const existingInventory = await queryOne(
                'SELECT id FROM inventories WHERE menu_id = ?',
                [menuId]
            );

            if (existingInventory) {
                await query(
                    'UPDATE inventories SET daily_stock = ?, remaining_stock = ? WHERE menu_id = ?',
                    [daily_stock, daily_stock, menuId]
                );
            } else {
                await query(
                    'INSERT INTO inventories (menu_id, daily_stock, remaining_stock) VALUES (?, ?, ?)',
                    [menuId, daily_stock, daily_stock]
                );
            }
        }

        // Fetch updated menu
        const updatedMenu = await queryOne<Menu>(
            `SELECT m.*, c.name as category_name,
                    i.daily_stock, i.remaining_stock
             FROM menus m
             LEFT JOIN categories c ON m.category_id = c.id
             LEFT JOIN inventories i ON m.id = i.menu_id
             WHERE m.id = ?`,
            [menuId]
        );

        return successResponse(updatedMenu, 'Menu updated successfully');
    } catch (error) {
        return handleApiError(error);
    }
}

// DELETE menu
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const menuId = parseInt(id);

        // Check if menu exists
        const menu = await queryOne('SELECT id FROM menus WHERE id = ?', [menuId]);
        if (!menu) {
            return errorResponse('Menu not found', 404);
        }

        // Delete inventory first (foreign key constraint)
        await query('DELETE FROM inventories WHERE menu_id = ?', [menuId]);

        // Delete menu
        await query('DELETE FROM menus WHERE id = ?', [menuId]);

        return successResponse(null, 'Menu deleted successfully');
    } catch (error) {
        return handleApiError(error);
    }
}
