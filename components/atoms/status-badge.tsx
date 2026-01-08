// ============================================
// RESTAUS - Status Badge Component (Atom)
// ============================================

'use client';

import { cn } from '@/lib/utils';
import { TableStatus, OrderStatus, OrderItemStatus } from '@/types';
import { TABLE_STATUS_COLORS, ORDER_STATUS_COLORS, ORDER_ITEM_STATUS_COLORS } from '@/constants';

interface StatusBadgeProps {
    type: 'table' | 'order' | 'item';
    status: TableStatus | OrderStatus | OrderItemStatus;
    className?: string;
    showIcon?: boolean;
}

export function StatusBadge({ type, status, className, showIcon = false }: StatusBadgeProps) {
    const getStatusConfig = () => {
        switch (type) {
            case 'table':
                return TABLE_STATUS_COLORS[status as TableStatus];
            case 'order':
                return ORDER_STATUS_COLORS[status as OrderStatus];
            case 'item':
                return ORDER_ITEM_STATUS_COLORS[status as OrderItemStatus];
            default:
                return { bg: 'bg-gray-500', text: 'text-gray-700', label: status };
        }
    };

    const config = getStatusConfig();

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                config.bg,
                'text-white',
                className
            )}
        >
            {showIcon && (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            {config.label}
        </span>
    );
}
