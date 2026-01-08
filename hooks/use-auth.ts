// ============================================
// RESTAUS - Authentication Hook
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginCredentials, AuthSession, UserRole } from '@/types';
import { STORAGE_KEYS, ROLE_ROUTES, TOAST_MESSAGES } from '@/constants';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export interface RegisterCredentials {
    username: string;
    password: string;
    full_name: string;
    role: UserRole;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
                if (userData) {
                    const parsedUser = JSON.parse(userData) as User;
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Failed to load user data:', error);
                localStorage.removeItem(STORAGE_KEYS.USER_DATA);
                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            const response = await api.post<AuthSession>('/api/auth/login', credentials);

            if (response.success && response.data) {
                const { user, token } = response.data;

                // Save to localStorage
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
                if (token) {
                    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
                }

                setUser(user);
                setIsAuthenticated(true);
                toast.success(TOAST_MESSAGES.LOGIN_SUCCESS);

                // Redirect based on role
                const redirectPath = ROLE_ROUTES[user.role as UserRole];
                router.push(redirectPath);

                return { success: true };
            } else {
                toast.error(response.error || TOAST_MESSAGES.LOGIN_FAILED);
                return { success: false, error: response.error };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TOAST_MESSAGES.NETWORK_ERROR;
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Register function
    const register = useCallback(async (data: RegisterCredentials) => {
        try {
            setLoading(true);
            const response = await api.post<AuthSession>('/api/auth/register', data);

            if (response.success && response.data) {
                toast.success('Registration successful! Please login.');
                router.push('/login');
                return { success: true };
            } else {
                toast.error(response.error || 'Registration failed');
                return { success: false, error: response.error };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : TOAST_MESSAGES.NETWORK_ERROR;
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Logout function
    const logout = useCallback(async () => {
        try {
            // Call logout API (optional)
            await api.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.CART);

            setUser(null);
            setIsAuthenticated(false);
            toast.success(TOAST_MESSAGES.LOGOUT_SUCCESS);
            router.push('/login');
        }
    }, [router]);

    // Check if user has specific role
    const hasRole = useCallback((role: UserRole | UserRole[]) => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.role as UserRole);
        }
        return user.role === role;
    }, [user]);

    // Require authentication
    const requireAuth = useCallback((allowedRoles?: UserRole[]) => {
        if (!isAuthenticated || !user) {
            router.push('/login');
            return false;
        }

        if (allowedRoles && !hasRole(allowedRoles)) {
            toast.error(TOAST_MESSAGES.UNAUTHORIZED);
            router.push(ROLE_ROUTES[user.role as UserRole]);
            return false;
        }

        return true;
    }, [isAuthenticated, user, router, hasRole]);

    return {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        hasRole,
        requireAuth,
    };
}
