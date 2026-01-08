// ============================================
// RESTAUS - Tables Data Hook
// ============================================

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableStatus } from '@/types';
import { QUERY_KEYS, TABLE_STATUS_POLL_INTERVAL } from '@/constants';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

// Fetch all tables
export function useTables(autoRefresh = true) {
    return useQuery({
        queryKey: [QUERY_KEYS.TABLES],
        queryFn: async () => {
            const response = await api.get<Table[]>('/api/tables');
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data || [];
        },
        refetchInterval: autoRefresh ? TABLE_STATUS_POLL_INTERVAL : false,
        staleTime: 3000,
    });
}

// Fetch single table
export function useTable(tableId: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.TABLE_DETAIL, tableId],
        queryFn: async () => {
            const response = await api.get<Table>(`/api/tables/${tableId}`);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        enabled: !!tableId,
    });
}

// Update table status
export function useUpdateTableStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ tableId, status }: { tableId: number; status: TableStatus }) => {
            const response = await api.patch<Table>(`/api/tables/${tableId}/status`, { status });
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
            toast.success('Table status updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update table status');
        },
    });
}

// Create table
export function useCreateTable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { table_number: string; capacity: number }) => {
            const response = await api.post<Table>('/api/tables', data);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
            toast.success('Table created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create table');
        },
    });
}

// Delete table
export function useDeleteTable() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tableId: number) => {
            const response = await api.delete(`/api/tables/${tableId}`);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
            toast.success('Table deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete table');
        },
    });
}

// Get tables with warnings (delivered but not paid)
export function useTablesWithWarnings() {
    const { data: tables = [] } = useTables(true);

    return tables.filter(table => table.warning === true);
}

// Get available tables
export function useAvailableTables() {
    const { data: tables = [] } = useTables(false);

    return tables.filter(table => table.status === 'available');
}
