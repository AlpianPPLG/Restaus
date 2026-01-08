// ============================================
// RESTAUS - Logout API Route
// ============================================

import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api-response';

export async function POST(request: NextRequest) {
    // In a real application, you would invalidate the session/token here
    // For now, just return success
    const response = successResponse(null, 'Logged out successfully');
    response.cookies.delete('restaus_auth_token');
    return response;
}
