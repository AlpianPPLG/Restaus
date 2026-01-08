// ============================================
// RESTAUS - Receipt Preview Component
// ============================================

'use client';

import { Order } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UtensilsCrossed } from 'lucide-react';
import { format } from 'date-fns';

interface ReceiptPreviewProps {
    order: Order;
    className?: string;
}

export function ReceiptPreview({ order, className }: ReceiptPreviewProps) {
    const subtotal = order.total_amount || 0;
    // Assuming tax and service are inclusive or 0 for now as per simple logic
    // You can extend this to calculate tax separately

    return (
        <Card className={`w-[80mm] mx-auto bg-white text-black font-mono text-sm shadow-none print:shadow-none print:w-full ${className}`}>
            <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="text-center space-y-1">
                    <div className="flex justify-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">
                            <UtensilsCrossed className="w-4 h-4" />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold uppercase tracking-wider">RESTAUS</h1>
                    <p className="text-xs text-gray-500">Jl. Suka Makan No. 123</p>
                    <p className="text-xs text-gray-500">Jakarta Selatan, 12345</p>
                    <p className="text-xs text-gray-500">Tel: (021) 555-0123</p>
                </div>

                <Separator className="bg-black/20" />

                {/* Info */}
                <div className="flex justify-between text-xs">
                    <div className="space-y-1">
                        <p>Order #{order.id}</p>
                        <p>{format(new Date(order.created_at), 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p>{order.table ? `Table ${order.table.table_number}` : 'Take Away'}</p>
                        <p>{order.waiter?.full_name || 'Staff'}</p>
                    </div>
                </div>

                <Separator className="bg-black/20 print:border-t print:border-black print:border-dashed" />

                {/* Items */}
                <div className="space-y-2">
                    {order.items?.map((item, i) => (
                        <div key={i} className="flex justify-between items-start">
                            <div className="flex-1">
                                <p className="font-bold">{item.menu?.name}</p>
                                <p className="text-xs text-gray-500">
                                    {item.quantity} x {item.price_at_time.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <p className="font-medium">
                                {(item.quantity * item.price_at_time).toLocaleString('id-ID')}
                            </p>
                        </div>
                    ))}
                </div>

                <Separator className="bg-black/20 print:border-t print:border-black print:border-dashed" />

                {/* Totals */}
                <div className="space-y-1">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>{subtotal.toLocaleString('id-ID')}</p>
                    </div>
                    {/* Tax/Service placehoders
          <div className="flex justify-between text-xs text-gray-500">
            <p>Service (5%)</p>
            <p>{(subtotal * 0.05).toLocaleString('id-ID')}</p>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <p>Tax (10%)</p>
            <p>{(subtotal * 0.1).toLocaleString('id-ID')}</p>
          </div>
          */}
                    <Separator className="my-2 bg-black/50" />
                    <div className="flex justify-between text-lg font-bold">
                        <p>TOTAL</p>
                        <p>Rp {subtotal.toLocaleString('id-ID')}</p>
                    </div>
                </div>

                <Separator className="bg-black/20" />

                {/* Footer */}
                <div className="text-center space-y-2 text-xs">
                    <p>Thank you for dining with us!</p>
                    <p>Please come again</p>
                    <p className="text-[10px] text-gray-400 mt-4">Powered by RESTAUS</p>
                </div>
            </CardContent>
        </Card>
    );
}
