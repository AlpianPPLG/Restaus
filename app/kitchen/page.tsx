// ============================================
// RESTAUS - Kitchen Dashboard Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useKitchenQueue, useUpdateOrderItemStatus } from '@/hooks/use-orders';
import { KitchenQueue } from '@/components/organisms/kitchen-queue';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, LogOut, RefreshCw, User } from 'lucide-react';
import { toast } from 'sonner';
import { OrderItemStatus } from '@/types';

export default function KitchenDashboard() {
    const router = useRouter();
    const { user, logout, requireAuth, loading } = useAuth();

    // Custom hook for polling orders specifically designed for kitchen layout
    const { data: orders = [], isLoading, refetch } = useKitchenQueue();
    const updateItemStatus = useUpdateOrderItemStatus();

    // Require kitchen or admin role
    useEffect(() => {
        if (!loading) {
            requireAuth(['kitchen', 'admin']);
        }
    }, [requireAuth, loading]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleRefresh = () => {
        refetch();
        toast.info('Refreshing queue...');
    };

    const handleItemStatusUpdate = async (itemId: number, status: OrderItemStatus) => {
        try {
            await updateItemStatus.mutateAsync({ itemId, status });
            // Queue update is handled by invalidation in the hook
        } catch (error) {
            console.error('Failed to update item status:', error);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-gray-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Branding */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/20">
                                <UtensilsCrossed className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                                    KDS
                                </h1>
                                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mt-1">
                                    KITCHEN DISPLAY SYSTEM
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user?.full_name || 'Chef'}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                className="hidden sm:flex"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                <KitchenQueue
                    orders={orders}
                    isLoading={isLoading}
                    onItemStatusUpdate={handleItemStatusUpdate}
                />
            </main>
        </div>
    );
}
