// ============================================
// RESTAUS - Categories API Route
// ============================================

import { NextRequest } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, handleApiError } from '@/lib/api-response';
import { Category } from '@/types';

// GET all categories
export async function GET(request: NextRequest) {
    try {
        const categories = await query<Category[]>(`
      SELECT * FROM categories
      ORDER BY sort_order, name
    `);

        return successResponse(categories);
    } catch (error) {
        return handleApiError(error);
    }
}
