// ============================================
// RESTAUS - Users API Route
// ============================================

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { successResponse, serverErrorResponse } from '@/lib/api-response';
import { User } from '@/types';

export async function GET() {
    try {
        // Fetch users excluding password hash
        const users = await query<User>(
            'SELECT id, username, full_name, role, created_at FROM users ORDER BY created_at DESC'
        );

        return successResponse(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return serverErrorResponse(error instanceof Error ? error : undefined);
    }
}
