// ============================================
// RESTAUS - Waiter Dashboard Page
// ============================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useTables } from '@/hooks/use-tables';
import { TableGrid } from '@/components/organisms/table-grid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, RefreshCw, LogOut, User, Clock } from 'lucide-react';
import { Table } from '@/types';
import { toast } from 'sonner';

export default function WaiterDashboard() {
    const router = useRouter();
    const { user, logout, requireAuth, loading } = useAuth();
    const { data: tables = [], isLoading, refetch } = useTables(true); // Auto-refresh enabled

    // Require waiter authentication
    useEffect(() => {
        if (!loading) {
            requireAuth(['waiter', 'admin']);
        }
    }, [requireAuth, loading]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const handleTableClick = (table: Table) => {
        if (table.status === 'available') {
            // Navigate to order creation
            router.push(`/waiter/order/new?table=${table.id}`);
        } else {
            // Navigate to view existing order
            toast.info(`Table ${table.table_number} is currently ${table.status}`);
            // router.push(`/waiter/order/${table.current_order?.id}`);
        }
    };

    const handleRefresh = () => {
        refetch();
        toast.success('Tables refreshed');
    };

    const handleLogout = async () => {
        await logout();
    };

    // Calculate stats
    const stats = {
        total: tables.length,
        available: tables.filter(t => t.status === 'available').length,
        occupied: tables.filter(t => t.status === 'occupied' || t.status === 'reserved').length,
        warnings: tables.filter(t => t.warning).length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                <UtensilsCrossed className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    RESTAUS
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Waiter Dashboard
                                </p>
                            </div>
                        </div>

                        {/* User Info & Actions */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>

                            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.full_name || user?.username}
                                </span>
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-blue-100">Total Tables</CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-green-100">Available</CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.available}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-orange-100">Occupied</CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.occupied}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-red-100">Warnings</CardDescription>
                            <CardTitle className="text-3xl font-bold">{stats.warnings}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Auto-refresh Indicator */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Auto-refresh every 5 seconds</span>
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                </div>

                {/* Table Grid */}
                <TableGrid
                    tables={tables}
                    isLoading={isLoading}
                    onTableClick={handleTableClick}
                    onRefresh={handleRefresh}
                />
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>© 2026 RESTAUS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
