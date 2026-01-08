// ============================================
// RESTAUS - Menus Data Hook
// ============================================

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Menu, Category, MenuFilters, MenuFormData } from '@/types';
import { QUERY_KEYS } from '@/constants';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

// Fetch all categories
export function useCategories() {
    return useQuery({
        queryKey: [QUERY_KEYS.CATEGORIES],
        queryFn: async () => {
            const response = await api.get<Category[]>('/api/categories');
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data || [];
        },
        staleTime: 60000, // 1 minute
    });
}

// Fetch all menus with filters
export function useMenus(filters?: MenuFilters) {
    return useQuery({
        queryKey: [QUERY_KEYS.MENUS, filters],
        queryFn: async () => {
            const response = await api.get<Menu[]>('/api/menus', filters);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data || [];
        },
        staleTime: 30000, // 30 seconds
    });
}

// Fetch single menu
export function useMenu(menuId: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.MENU_DETAIL, menuId],
        queryFn: async () => {
            const response = await api.get<Menu>(`/api/menus/${menuId}`);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        enabled: !!menuId,
    });
}

// Create menu
export function useCreateMenu() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: MenuFormData) => {
            const response = await api.post<Menu>('/api/menus', data);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENUS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORIES] });
            toast.success('Menu created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create menu');
        },
    });
}

// Update menu
export function useUpdateMenu() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<MenuFormData> }) => {
            const response = await api.put<Menu>(`/api/menus/${id}`, data);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENUS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORIES] });
            toast.success('Menu updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update menu');
        },
    });
}

// Delete menu
export function useDeleteMenu() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (menuId: number) => {
            const response = await api.delete(`/api/menus/${menuId}`);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENUS] });
            toast.success('Menu deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete menu');
        },
    });
}

// Toggle menu active status
export function useToggleMenuStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
            const response = await api.patch<Menu>(`/api/menus/${id}/status`, { is_active });
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENUS] });
            toast.success('Menu status updated');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update menu status');
        },
    });
}

// Get menus by category
export function useMenusByCategory(categoryId: number) {
    return useMenus({ category_id: categoryId, is_active: true, in_stock: true });
}

// Search menus
export function useSearchMenus(searchTerm: string) {
    return useMenus({ search: searchTerm, is_active: true });
}
