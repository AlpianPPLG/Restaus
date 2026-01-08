// ============================================
// RESTAUS - Kitchen Queue Component (Organism)
// ============================================

'use client';

import { Order, OrderItemStatus } from '@/types';
import { KitchenOrderCard } from '@/components/molecules/kitchen-order-card';
import { Loader2, Inbox, ChefHat } from 'lucide-react';

interface KitchenQueueProps {
    orders: Order[];
    isLoading?: boolean;
    onItemStatusUpdate: (itemId: number, status: OrderItemStatus) => void;
}

export function KitchenQueue({
    orders,
    isLoading,
    onItemStatusUpdate
}: KitchenQueueProps) {

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-500">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-orange-500" />
                <p className="font-medium">Syncing with dining room...</p>
            </div>
        );
    }

    const activeOrders = orders.filter(o => o.status === 'processing' || o.status === 'pending');
    const pendingCount = activeOrders.length;

    if (activeOrders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-gray-400">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <ChefHat className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300">All Caught Up!</h3>
                <p>No active orders in the queue.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Inbox className="w-6 h-6 text-orange-600" />
                    Active Orders ({pendingCount})
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeOrders.map((order) => (
                    <KitchenOrderCard
                        key={order.id}
                        order={order}
                        onItemStatusUpdate={onItemStatusUpdate}
                    />
                ))}
            </div>
        </div>
    );
}
