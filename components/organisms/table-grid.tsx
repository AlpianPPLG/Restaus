// ============================================
// RESTAUS - Table Grid Component (Organism)
// ============================================

'use client';

import { Table } from '@/types';
import { TableCard } from '@/components/molecules/table-card';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableGridProps {
    tables: Table[];
    isLoading?: boolean;
    onTableClick?: (table: Table) => void;
    onRefresh?: () => void;
}

export function TableGrid({ tables, isLoading, onTableClick, onRefresh }: TableGridProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading tables...</p>
                </div>
            </div>
        );
    }

    if (!tables || tables.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No tables found</p>
                    {onRefresh && (
                        <Button onClick={onRefresh} variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // Group tables by status for better organization
    const availableTables = tables.filter(t => t.status === 'available');
    const occupiedTables = tables.filter(t => t.status === 'occupied' || t.status === 'reserved');
    const warningTables = tables.filter(t => t.warning);

    return (
        <div className="space-y-8">
            {/* Warning Tables - Show First */}
            {warningTables.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
                            ⚠️ Payment Pending ({warningTables.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {warningTables.map((table) => (
                            <TableCard
                                key={table.id}
                                table={table}
                                onClick={() => onTableClick?.(table)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Occupied Tables */}
            {occupiedTables.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Occupied Tables ({occupiedTables.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {occupiedTables.map((table) => (
                            <TableCard
                                key={table.id}
                                table={table}
                                onClick={() => onTableClick?.(table)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Available Tables */}
            {availableTables.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-lg font-semibold text-green-600 dark:text-green-400">
                            Available Tables ({availableTables.length})
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {availableTables.map((table) => (
                            <TableCard
                                key={table.id}
                                table={table}
                                onClick={() => onTableClick?.(table)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
