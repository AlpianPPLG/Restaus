// ============================================
// RESTAUS - API Response Helpers
// ============================================

import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

// Success response
export function successResponse<T = any>(
    data: T,
    message?: string,
    status = 200
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            message,
        },
        { status }
    );
}

// Error response
export function errorResponse(
    error: string,
    status = 400
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error,
        },
        { status }
    );
}

// Validation error response
export function validationError(
    errors: Record<string, string[]>
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            error: 'Validation failed',
            data: errors,
        },
        { status: 422 }
    );
}

// Not found response
export function notFoundResponse(
    resource = 'Resource'
): NextResponse<ApiResponse> {
    return errorResponse(`${resource} not found`, 404);
}

// Unauthorized response
export function unauthorizedResponse(
    message = 'Unauthorized access'
): NextResponse<ApiResponse> {
    return errorResponse(message, 401);
}

// Forbidden response
export function forbiddenResponse(
    message = 'Access forbidden'
): NextResponse<ApiResponse> {
    return errorResponse(message, 403);
}

// Server error response
export function serverErrorResponse(
    error?: Error
): NextResponse<ApiResponse> {
    console.error('Server Error:', error);
    return errorResponse(
        error?.message || 'Internal server error',
        500
    );
}

// Handle API errors
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
    if (error instanceof Error) {
        // Check for specific error types
        if (error.message.includes('not found')) {
            return notFoundResponse();
        }
        if (error.message.includes('unauthorized')) {
            return unauthorizedResponse();
        }
        if (error.message.includes('forbidden')) {
            return forbiddenResponse();
        }

        return serverErrorResponse(error);
    }

    return serverErrorResponse();
}
