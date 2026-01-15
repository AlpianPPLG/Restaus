// ============================================
// RESTAUS - API Client Utilities
// ============================================

import { ApiResponse } from '@/types';

// Base fetch wrapper with error handling
async function fetchAPI<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        let data;
        const text = await response.text();
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('API Invalid JSON:', text.substring(0, 500)); // Log first 500 chars
            return {
                success: false,
                error: `Invalid server response (${response.status}): ${text.substring(0, 100)}...`,
            };
        }

        if (!response.ok) {
            return {
                success: false,
                error: data.error || data.message || 'An error occurred',
            };
        }

        return {
            success: true,
            data: data.data || data,
            message: data.message,
        };
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
        };
    }
}

// GET request
export async function get<T = any>(
    endpoint: string,
    params?: Record<string, any>
): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, window.location.origin);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }
    return fetchAPI<T>(url.toString(), { method: 'GET' });
}

// POST request
export async function post<T = any>(
    endpoint: string,
    data?: any
): Promise<ApiResponse<T>> {
    return fetchAPI<T>(endpoint, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
    });
}

// PUT request
export async function put<T = any>(
    endpoint: string,
    data?: any
): Promise<ApiResponse<T>> {
    return fetchAPI<T>(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    });
}

// PATCH request
export async function patch<T = any>(
    endpoint: string,
    data?: any
): Promise<ApiResponse<T>> {
    return fetchAPI<T>(endpoint, {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
    });
}

// DELETE request
export async function del<T = any>(
    endpoint: string
): Promise<ApiResponse<T>> {
    return fetchAPI<T>(endpoint, { method: 'DELETE' });
}

// Upload file
export async function upload<T = any>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, String(value));
        });
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || data.message || 'Upload failed',
            };
        }

        return {
            success: true,
            data: data.data || data,
            message: data.message,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload error',
        };
    }
}

export const api = {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
};

export default api;
