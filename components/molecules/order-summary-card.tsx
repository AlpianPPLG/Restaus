// ============================================
// RESTAUS - Order Summary Card (Cashier)
// ============================================

'use client';

import { Order } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OrderSummaryCardProps {
    order: Order;
    isSelected?: boolean;
    onClick?: () => void;
}

export function OrderSummaryCard({ order, isSelected, onClick }: OrderSummaryCardProps) {
    const elapsed = formatDistanceToNow(new Date(order.updated_at), { addSuffix: true });
    const isLate = new Date().getTime() - new Date(order.updated_at).getTime() > 5 * 60 * 1000; // 5 mins after delivery

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4",
                isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-md ring-1 ring-blue-500/20"
                    : "bg-white dark:bg-gray-900 border-transparent hover:border-blue-200",
                order.status === 'delivered' && isLate && !isSelected && "border-red-500 bg-red-50/10",
                "mb-3"
            )}
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <Badge className="text-lg font-bold px-2 py-1 bg-gray-900 text-white hover:bg-gray-800">
                            {order.table?.table_number || 'Take Away'}
                        </Badge>
                        <Badge variant={order.order_type === 'dine_in' ? 'secondary' : 'outline'}>
                            {order.order_type === 'dine_in' ? 'Dine In' : 'Take Away'}
                        </Badge>
                    </div>
                    <span className="font-bold text-lg text-green-600">
                        Rp {order.total_amount?.toLocaleString('id-ID')}
                    </span>
                </div>

                <div className="flex justify-between items-end text-sm text-gray-500">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5" />
                            <span>{order.customer_name || 'Guest'}</span>
                        </div>
                        <div className="text-xs">
                            Order #{order.id} • {order.items?.length || 0} items
                        </div>
                    </div>

                    <div className="text-right">
                        <div className={cn("flex items-center gap-1", isLate && "text-red-500 font-medium")}>
                            <Clock className="w-3.5 h-3.5" />
                            <span>{elapsed}</span>
                        </div>
                        <span className="text-xs block mt-1">
                            Warn: {isLate ? 'YES' : 'NO'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
