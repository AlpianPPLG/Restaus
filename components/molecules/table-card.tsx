// ============================================
// RESTAUS - Table Card Component (Molecule)
// ============================================

'use client';

import { Table } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/atoms/status-badge';
import { cn } from '@/lib/utils';
import { Users, AlertTriangle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TableCardProps {
    table: Table;
    onClick?: () => void;
    className?: string;
}

export function TableCard({ table, onClick, className }: TableCardProps) {
    const isAvailable = table.status === 'available';
    const hasWarning = table.warning;
    const hasActiveOrder = table.current_order;

    // Calculate time since order created
    const orderDuration = hasActiveOrder
        ? formatDistanceToNow(new Date(table.current_order!.created_at), { addSuffix: false })
        : null;

    return (
        <Card
            onClick={onClick}
            className={cn(
                'relative overflow-hidden transition-all duration-300 cursor-pointer group',
                'hover:shadow-xl hover:scale-105',
                isAvailable && 'border-green-500 bg-green-50 dark:bg-green-950/20',
                table.status === 'reserved' && 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
                table.status === 'occupied' && 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
                hasWarning && 'border-red-500 bg-red-50 dark:bg-red-950/20 animate-pulse',
                className
            )}
        >
            {/* Warning Indicator */}
            {hasWarning && (
                <div className="absolute top-0 right-0 p-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
                </div>
            )}

            <CardContent className="p-6">
                {/* Table Number */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {table.table_number}
                    </h3>
                    <StatusBadge type="table" status={table.status} showIcon={!isAvailable} />
                </div>

                {/* Capacity */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {table.capacity} persons</span>
                </div>

                {/* Order Info */}
                {hasActiveOrder && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{orderDuration}</span>
                        </div>
                        {table.current_order?.status && (
                            <div className="mt-2">
                                <StatusBadge
                                    type="order"
                                    status={table.current_order.status}
                                    className="text-xs"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Available Message */}
                {isAvailable && (
                    <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                            Click to start new order
                        </p>
                    </div>
                )}

                {/* Warning Message */}
                {hasWarning && (
                    <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                            ⚠️ Payment Pending!
                        </p>
                    </div>
                )}

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </CardContent>
        </Card>
    );
}
