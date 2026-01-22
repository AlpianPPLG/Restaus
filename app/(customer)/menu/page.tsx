import React from 'react';
import { query } from '@/lib/db';
import { Category, Menu } from '@/types';
import { MenuView } from '@/components/customer/menu-view';
import { CustomerCartProvider } from '@/hooks/use-customer-cart';
import { Suspense } from 'react';

// Next.js 15+ searchParams is a promise
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MenuPage({ searchParams }: Props) {
    const params = await searchParams;
    const tableId = typeof params.table === 'string' ? params.table : undefined;

    // Simple data fetching directly (Server Component)
    const categories = await query<Category[]>('SELECT * FROM categories ORDER BY sort_order');
    const rawMenus = await query<any[]>(`
        SELECT m.*, i.remaining_stock, i.daily_stock 
        FROM menus m 
        LEFT JOIN inventories i ON m.id = i.menu_id 
        WHERE m.is_active = 1 
        ORDER BY m.category_id, m.name
    `);

    // Map flat result to nested structure
    const menus: Menu[] = rawMenus.map((m) => ({
        ...m,
        inventory: {
            id: 0, // Mock ID or fetch if needed, usually not needed for display
            menu_id: m.id,
            remaining_stock: m.remaining_stock ?? 0, // Default to 0 if null (though standard should be set)
            daily_stock: m.daily_stock ?? 0,
            last_updated: new Date().toISOString()
        }
    }));

    return (
        <CustomerCartProvider>
            <div className="bg-white dark:bg-neutral-950 min-h-screen">
                <Suspense fallback={<div className="p-4 text-center">Loading menu...</div>}>
                    <MenuView
                        categories={categories}
                        menus={menus}
                        tableId={tableId}
                    />
                </Suspense>
            </div>
        </CustomerCartProvider>
    );
}
