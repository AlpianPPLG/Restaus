// ============================================
// RESTAUS - Payments Data Hook
// ============================================

'use client';

import { useMutation, useQueryClient } from '@tantml:invoke';
import { Payment, PaymentFormData } from '@/types';
import { QUERY_KEYS } from '@/constants';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

// Process payment
export function useProcessPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PaymentFormData) => {
            const response = await api.post<Payment>('/api/payments', data);
            if (!response.success) {
                throw new Error(response.error);
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PENDING_PAYMENTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] });
            toast.success('Payment processed successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to process payment');
        },
    });
}

// Calculate change
export function useCalculateChange() {
    const calculateChange = (totalAmount: number, amountPaid: number) => {
        const change = amountPaid - totalAmount;
        return {
            change: change >= 0 ? change : 0,
            isValid: change >= 0,
            shortage: change < 0 ? Math.abs(change) : 0,
        };
    };

    return { calculateChange };
}

// Calculate total with tax and service charge
export function useCalculateTotal() {
    const calculateTotal = (
        subtotal: number,
        taxPercentage = 10,
        serviceChargePercentage = 5
    ) => {
        const tax = (subtotal * taxPercentage) / 100;
        const serviceCharge = (subtotal * serviceChargePercentage) / 100;
        const total = subtotal + tax + serviceCharge;

        return {
            subtotal,
            tax,
            serviceCharge,
            total,
        };
    };

    return { calculateTotal };
}
