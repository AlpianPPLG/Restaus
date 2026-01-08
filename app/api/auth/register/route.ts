// ============================================
// RESTAUS - Register API Route
// ============================================

import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-response';
import { User, UserRole } from '@/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, full_name, role } = body;

        // 1. Validation
        if (!username || !password || !full_name || !role) {
            return errorResponse('All fields are required', 400);
        }

        const validRoles: UserRole[] = ['admin', 'waiter', 'kitchen', 'cashier'];
        if (!validRoles.includes(role)) {
            return errorResponse('Invalid role specified', 400);
        }

        // 2. Check if username exists
        const existingUser = await queryOne<User>(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUser) {
            return errorResponse('Username already taken', 409);
        }

        // 3. Create User
        // Use plain text password for now (as per current system design)
        // In production, use bcrypt here.

        // Simpan token kosong atau generate jika diperlukan, tapi login akan mengurusnya

        const result = await query<{ insertId: number }>(
            'INSERT INTO users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
            [username, password, full_name, role]
        );

        const newUser = {
            id: result.insertId,
            username,
            full_name,
            role,
        };

        return successResponse(newUser, 'User registered successfully', 201);

    } catch (error) {
        console.error('Register API Error:', error);
        return serverErrorResponse(error instanceof Error ? error : undefined);
    }
}
