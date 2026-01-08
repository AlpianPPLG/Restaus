// ============================================
// RESTAUS - Orders Data Hook
// ============================================

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order, OrderFormData, OrderFilters, OrderItemStatus } from '@/types';
import { QUERY_KEYS, ORDER_QUEUE_POLL_INTERVAL } from '@/constants';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

// Fetch all orders with filters
export function useOrders(filters?: OrderFilters, autoRefresh = false) {
    return useQuery({
        queryKey: [QUERY_KEYS.ORDERS, filters],
        queryFn: async () => {
            const response = await api.get<Order[]>('/api/orders', filters);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data || [];
        },
        refetchInterval: autoRefresh ? ORDER_QUEUE_POLL_INTERVAL : false,
        staleTime: 3000,
    });
}

// Fetch single order
export function useOrder(orderId: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId],
        queryFn: async () => {
            const response = await api.get<Order>(`/api/orders/${orderId}`);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        enabled: !!orderId,
    });
}

// Create order
export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: OrderFormData) => {
            const response = await api.post<Order>('/api/orders', data);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORIES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KITCHEN_QUEUE] });
            toast.success('Order created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create order');
        },
    });
}

// Update order status
export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
            const response = await api.patch<Order>(`/api/orders/${orderId}/status`, { status });
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KITCHEN_QUEUE] });
            toast.success('Order status updated');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update order status');
        },
    });
}

// Update order item status
export function useUpdateOrderItemStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            itemId,
            status
        }: {
            itemId: number;
            status: OrderItemStatus
        }) => {
            const response = await api.patch(`/api/order-items/${itemId}/status`, { status });
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.KITCHEN_QUEUE] });
            toast.success('Item status updated');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update item status');
        },
    });
}

// Cancel order
export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (orderId: number) => {
            const response = await api.patch<Order>(`/api/orders/${orderId}/cancel`);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORIES] });
            toast.success('Order cancelled');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to cancel order');
        },
    });
}

// Kitchen queue (orders that need cooking)
export function useKitchenQueue() {
    return useOrders(
        { status: 'processing' },
        true // Auto-refresh for kitchen
    );
}

// Pending payments (delivered orders)
export function usePendingPayments() {
    return useOrders(
        { status: 'delivered' },
        true // Auto-refresh for cashier
    );
}

// Get active order for a table
export function useTableOrder(tableId: number) {
    return useQuery({
        queryKey: [QUERY_KEYS.ORDERS, 'table', tableId],
        queryFn: async () => {
            const response = await api.get<Order>(`/api/tables/${tableId}/order`);
            if (!response.success) {
                return null;
            }
            return response.data;
        },
        enabled: !!tableId,
    });
}
