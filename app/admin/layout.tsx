// ============================================
// RESTAUS - Admin Layout
// ============================================

'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    UtensilsCrossed,
    Table as TableIcon,
    Users,
    Settings,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, requireAuth, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            requireAuth(['admin']);
        }
    }, [requireAuth, loading]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: UtensilsCrossed, label: 'Menu Management', href: '/admin/menus' },
        { icon: TableIcon, label: 'Tables', href: '/admin/tables' },
        { icon: Users, label: 'Staff', href: '/admin/users' },
        { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ];

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col fixed inset-y-0">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                            <span className="text-white dark:text-gray-900 font-bold text-lg">R</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start gap-3 mb-1",
                                        isActive
                                            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.full_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">Administrator</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 z-50 p-4 flex justify-between items-center">
                <span className="font-bold">Restaus Admin</span>
                <Button size="icon" variant="ghost">
                    {/* Mobile menu trigger would go here */}
                </Button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 mt-14 md:mt-0">
                {children}
            </main>
        </div>
    );
}
