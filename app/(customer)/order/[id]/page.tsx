import React, { Suspense } from 'react';
import { OrderStatusView } from '@/components/customer/order-status-view';

type Props = {
    params: Promise<{ id: string }>;
};

export default async function OrderStatusPage({ params }: Props) {
    const { id } = await params;

    return (
        <div className="bg-white dark:bg-neutral-950 min-h-screen">
            <Suspense fallback={<div className="p-10 text-center">Loading status...</div>}>
                <OrderStatusView orderId={id} />
            </Suspense>
        </div>
    );
}
