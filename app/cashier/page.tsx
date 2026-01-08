// ============================================
// RESTAUS - Cashier Dashboard Page
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { usePendingPayments } from '@/hooks/use-orders';
import { OrderSummaryCard } from '@/components/molecules/order-summary-card';
import { PaymentForm } from '@/components/organisms/payment-form';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UtensilsCrossed, LogOut, Search, RefreshCw, User, Store } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export default function CashierDashboard() {
    const router = useRouter();
    const { user, logout, requireAuth, loading } = useAuth();
    const { data: orders = [], isLoading, refetch } = usePendingPayments();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Require cashier or admin role
    useEffect(() => {
        if (!loading) {
            requireAuth(['cashier', 'admin']);
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
        toast.info('Refreshing orders...');
    };

    const handlePaymentSuccess = (orderId: number) => {
        setSelectedOrder(null);
        refetch();
        router.push(`/receipt/${orderId}`);
    };

    // Filter orders
    const filteredOrders = orders.filter(order => {
        const searchLower = searchTerm.toLowerCase();
        return (
            order.table?.table_number.toLowerCase().includes(searchLower) ||
            order.customer_name?.toLowerCase().includes(searchLower) ||
            order.id.toString().includes(searchLower)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 flex-none">
                <div className="px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                                    CASHIER
                                </h1>
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                                    POINT OF SALES
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {user?.full_name || 'Cashier'}
                                </span>
                            </div>

                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>

                            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content (Split View) */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Order List */}
                <div className="w-full md:w-1/3 lg:w-[400px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search table, name or ID..."
                                className="pl-9 bg-gray-50 dark:bg-gray-800"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="mt-2 text-xs text-gray-500 font-medium">
                            {filteredOrders.length} Pending Payments
                        </div>
                    </div>

                    <ScrollArea className="flex-1 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="p-4 space-y-3">
                            {filteredOrders.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <p>No pending payments found.</p>
                                </div>
                            ) : (
                                filteredOrders.map((order) => (
                                    <OrderSummaryCard
                                        key={order.id}
                                        order={order}
                                        isSelected={selectedOrder?.id === order.id}
                                        onClick={() => setSelectedOrder(order)}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Content: Payment Form */}
                <div className="flex-1 bg-white dark:bg-gray-900 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-2xl mx-auto h-full">
                        <PaymentForm
                            order={selectedOrder}
                            onSuccess={handlePaymentSuccess}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
