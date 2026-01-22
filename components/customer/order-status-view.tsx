'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { Order, OrderItem } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, ChefHat, Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

async function fetchOrder(id: string) {
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch order');
    }
    const data = await res.json();
    return data.data as Order;
}

export function OrderStatusView({ orderId }: { orderId: string }) {
    const router = useRouter();
    const { data: order, isLoading, error } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => fetchOrder(orderId),
        refetchInterval: 5000, // Poll every 5s
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-neutral-400 mb-4" />
                <p className="text-neutral-500">Memuat status pesanan...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-bold text-red-500 mb-2">Terjadi Kesalahan</h2>
                <p className="text-neutral-600 mb-4">Pesanan tidak ditemukan atau terjadi gangguan.</p>
                <Button onClick={() => router.push('/menu')}>Kembali ke Menu</Button>
            </div>
        );
    }

    // Status Steps
    const steps = [
        { status: 'pending', label: 'Menunggu Konfirmasi', icon: Clock },
        { status: 'processing', label: 'Sedang Disiapkan', icon: ChefHat },
        { status: 'completed', label: 'Sudah Selesai', icon: CheckCircle2 },
    ];

    // Simple status mapping logic for UI display
    let currentStepIndex = 0;
    const status = order.status;

    if (status === 'pending') currentStepIndex = 0;
    else if (status === 'processing') currentStepIndex = 1;
    else if (status === 'delivered' || status === 'completed') currentStepIndex = 2; // delivered = siap diantar, completed = sudah selesai/bayar
    else if (status === 'cancelled') currentStepIndex = -1;

    return (
        <div className="p-4 pb-24 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.push('/menu')} className="-ml-2">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">Status Pesanan #{order.id}</h1>
            </div>

            {/* Status Card */}
            <Card className="p-6 border-none shadow-lg bg-gradient-to-br from-neutral-800 to-black text-white">
                {status === 'cancelled' ? (
                    <div className="text-center py-4">
                        <h2 className="text-2xl font-bold text-red-400">Pesanan Dibatalkan</h2>
                        <p className="opacity-80 mt-2">Silakan hubungi pelayan.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-70">Estimasi Selesai</p>
                                <p className="text-2xl font-bold">~15 Menit</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                {currentStepIndex === 0 && <Clock className="w-6 h-6 animate-pulse" />}
                                {currentStepIndex === 1 && <ChefHat className="w-6 h-6 animate-bounce" />}
                                {currentStepIndex >= 2 && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                            </div>
                        </div>

                        {/* Stepper */}
                        <div className="space-y-4">
                            {steps.map((step, idx) => {
                                const isActive = idx === currentStepIndex;
                                const isCompleted = idx < currentStepIndex;
                                const Icon = step.icon;

                                return (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                                            isActive
                                                ? (idx === 2 ? "bg-green-500 text-white border-green-500" : "bg-white text-black border-white")
                                                : isCompleted
                                                    ? "bg-green-500 text-white border-green-500"
                                                    : "border-white/20 text-white/20"
                                        )}>
                                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        <div className={cn("flex-1", isActive ? "opacity-100 font-bold" : isCompleted ? "opacity-80" : "opacity-30")}>
                                            {step.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>

            {/* Order Items */}
            <div className="space-y-4">
                <h3 className="font-bold text-lg">Detail Menu</h3>
                {order.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-white dark:bg-neutral-900 border rounded-xl items-center">
                        <div className="w-16 h-16 bg-neutral-100 rounded-lg relative overflow-hidden flex-shrink-0">
                            {item.menu_image && <Image src={item.menu_image} alt="menu" fill className="object-cover" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{item.menu_name}</p>
                            <p className="text-xs text-neutral-500">{item.special_notes}</p>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs font-bold text-neutral-400">x{item.quantity}</span>
                                <span className="text-sm font-bold">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price_at_time * item.quantity)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <Card className="p-4 space-y-2 bg-neutral-50 dark:bg-neutral-900 border-none">
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Subtotal</span>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Pajak & Layanan</span>
                    <span>Rp 0</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.total_amount)}</span>
                </div>
            </Card>

            <div className="flex justify-center text-xs text-neutral-400 text-center">
                <p>Silakan lakukan pembayaran di kasir <br />dengan menunjukkan nomor meja atau ID Pesanan ini.</p>
            </div>
        </div>
    );
}
