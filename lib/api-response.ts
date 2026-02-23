// ============================================
// RESTAUS - API Response Helpers
// ============================================

import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

// Success response
export function successResponse<T = any>(
  data: T,
  message?: string,
  status = 200,
  headers?: Record<string, string>,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status, headers },
  );
}

// Error response
export function errorResponse(
  error: string,
  status = 400,
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status, headers },
  );
}

// Validation error response
export function validationError(
  errors: Record<string, string[]>,
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: "Validation failed",
      data: errors,
    },
    { status: 422, headers },
  );
}

// Not found response
export function notFoundResponse(
  resource = "Resource",
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  return errorResponse(`${resource} not found`, 404, headers);
}

// Unauthorized response
export function unauthorizedResponse(
  message = "Unauthorized access",
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  return errorResponse(message, 401, headers);
}

// Forbidden response
export function forbiddenResponse(
  message = "Access forbidden",
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  return errorResponse(message, 403, headers);
}

// Server error response
export function serverErrorResponse(
  error?: Error,
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  console.error("Server Error:", error);
  return errorResponse(error?.message || "Internal server error", 500, headers);
}

// Handle API errors
export function handleApiError(
  error: unknown,
  headers?: Record<string, string>,
): NextResponse<ApiResponse> {
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes("not found")) {
      return notFoundResponse(undefined, headers);
    }
    if (error.message.includes("unauthorized")) {
      return unauthorizedResponse(undefined, headers);
    }
    if (error.message.includes("forbidden")) {
      return forbiddenResponse(undefined, headers);
    }

    return serverErrorResponse(error, headers);
  }

  return serverErrorResponse(undefined, headers);
}
