// ============================================
// RESTAUS - Kitchen Order Card Component (Molecule)
// ============================================

'use client';

import { Order, OrderItem, OrderItemStatus } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, ChefHat, Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/atoms/status-badge';

interface KitchenOrderCardProps {
    order: Order;
    onItemStatusUpdate: (itemId: number, status: OrderItemStatus) => void;
    onOrderComplete?: (orderId: number) => void;
    className?: string;
}

export function KitchenOrderCard({
    order,
    onItemStatusUpdate,
    onOrderComplete,
    className,
}: KitchenOrderCardProps) {
    // Calculate elapsed time
    const elapsed = formatDistanceToNow(new Date(order.created_at), { addSuffix: true });

    // Check if order is late (e.g., > 20 mins)
    const isLate = new Date().getTime() - new Date(order.created_at).getTime() > 20 * 60 * 1000;

    const allServed = order.items?.every(item => item.status === 'served');

    return (
        <Card className={cn(
            'w-full shadow-md border-t-4 transition-all duration-300',
            isLate ? 'border-t-red-500 bg-red-50/10' : 'border-t-blue-500',
            className
        )}>
            <CardHeader className="pb-3 bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-lg font-bold px-3">
                                {order.table?.table_number || 'T--'}
                            </Badge>
                            <StatusBadge type="order" status={order.status} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Order #{order.id} • {order.waiter?.full_name || 'Waiter'}
                        </p>
                    </div>
                    <div className="flex flex-col items-end text-sm text-gray-500">
                        <div className={`flex items-center gap-1 font-medium ${isLate ? 'text-red-600 animate-pulse' : ''}`}>
                            <Clock className="w-3 h-3" />
                            {elapsed}
                        </div>
                        <span className="text-xs mt-1">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {order.items?.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "p-4 flex items-start justify-between group transition-colors",
                                item.status === 'served' ? 'bg-gray-50 dark:bg-gray-900/50 opacity-60' : 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                            )}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                                        {item.quantity}
                                    </span>
                                    <span className={cn("font-medium", item.status === 'served' && 'line-through')}>
                                        {item.menu?.name}
                                    </span>
                                </div>

                                {item.special_notes && (
                                    <div className="mt-1 ml-8 flex items-start gap-1 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-1.5 rounded-md inline-block">
                                        <AlertCircle className="w-3 h-3 mt-0.5" />
                                        <span className="font-semibold italic">{item.special_notes}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 pl-2">
                                {item.status === 'pending' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-blue-200 hover:bg-blue-100 text-blue-700"
                                        onClick={() => onItemStatusUpdate(item.id, 'cooking')}
                                    >
                                        <ChefHat className="w-4 h-4 mr-1" />
                                        Cook
                                    </Button>
                                )}

                                {item.status === 'cooking' && (
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => onItemStatusUpdate(item.id, 'served')}
                                    >
                                        <Check className="w-4 h-4 mr-1" />
                                        Done
                                    </Button>
                                )}

                                {item.status === 'served' && (
                                    <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">
                                        <Check className="w-3 h-3 mr-1" /> Served
                                    </Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="bg-gray-50/50 dark:bg-gray-800/50 p-3 flex justify-end">
                {allServed ? (
                    <div className="w-full text-center py-1 text-green-600 font-bold flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" /> All Items Served
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 text-center w-full">
                        Update items individually
                    </p>
                )}
            </CardFooter>
        </Card>
    );
}
