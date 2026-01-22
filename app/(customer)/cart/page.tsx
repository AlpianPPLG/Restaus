import React, { Suspense } from 'react';
import { CartView } from '@/components/customer/cart-view';
import { CustomerCartProvider } from '@/hooks/use-customer-cart';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CartPage({ searchParams }: Props) {
    const params = await searchParams;
    const tableId = typeof params.table === 'string' ? params.table : undefined;

    return (
        <CustomerCartProvider>
            <div className="bg-white dark:bg-neutral-950 min-h-screen">
                <Suspense fallback={<div className="p-4 text-center">Loading cart...</div>}>
                    <CartView tableId={tableId} />
                </Suspense>
            </div>
        </CustomerCartProvider>
    );
}
