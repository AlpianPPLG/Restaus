'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomerCart } from '@/hooks/use-customer-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export function CartView({ tableId }: { tableId?: string }) {
    const router = useRouter();
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCustomerCart();
    const [customerName, setCustomerName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If no tableId in URL, maybe ask for it? For now assume it's passed or optional (TakeAway?)
    // But logic says dine_in needs table_id. 
    // We'll enforce tableId if we want dine-in. 
    // For MVP, lets assume tableId is required or we default to 1 for testing if not provided

    const handleCheckout = async () => {
        if (!customerName.trim()) {
            toast.error('Mohon isi nama pemesan');
            return;
        }

        if (items.length === 0) {
            toast.error('Keranjang kosong');
            return;
        }

        setIsSubmitting(true);

        try {
            // Map cart items to API format
            const orderItems = items.map(item => ({
                menu_id: item.menuId,
                quantity: item.quantity,
                special_notes: item.notes
            }));

            // Hack: if no tableId, maybe prompt or error. For this demo, check if tableId is present.
            // The API requires table_id for dine_in. 
            // We will parse tableId to int.
            const tableIdInt = tableId ? parseInt(tableId) : null;

            if (!tableIdInt) {
                toast.error("Nomor meja tidak valid. Scan QR kembali.");
                setIsSubmitting(false);
                return;
            }

            const payload = {
                table_id: tableIdInt,
                customer_name: customerName,
                order_type: 'dine_in',
                items: orderItems,
            };

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Gagal membuat pesanan');
            }

            // Success
            toast.success('Pesanan berhasil dibuat!');
            clearCart();
            router.push(`/order/${data.data.id}`); // Redirect to status page

        } catch (error: any) {
            toast.error(error.message);
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBagIcon className="w-10 h-10 text-neutral-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Keranjang Kosong</h2>
                <p className="text-neutral-500 mb-6">Belum ada menu yang dipilih.</p>
                <Button onClick={() => router.back()} variant="outline">Kembali ke Menu</Button>
            </div>
        );
    }

    return (
        <div className="p-4 pb-24 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-xl font-bold">Ringkasan Pesanan</h1>
            </div>

            {/* Items List */}
            <div className="space-y-4">
                {items.map((item) => (
                    <Card key={item.id} className="p-3 flex gap-4 border-l-0 border-r-0 border-t-0 rounded-none shadow-none border-b">
                        <div className="w-20 h-20 bg-neutral-100 rounded-lg relative overflow-hidden flex-shrink-0">
                            {item.image_url ? (
                                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-xs text-neutral-400">No Img</div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-sm">{item.name}</h3>
                                <button onClick={() => removeItem(item.id)} className="text-red-500 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            {item.notes && <p className="text-xs text-neutral-500 italic">"{item.notes}"</p>}

                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                                </span>
                                <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                                    <button
                                        className="w-6 h-6 flex items-center justify-center bg-white dark:bg-black rounded shadow-sm text-xs font-bold disabled:opacity-50"
                                        onClick={() => updateQuantity(item.id, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                    <button
                                        className="w-6 h-6 flex items-center justify-center bg-white dark:bg-black rounded shadow-sm text-xs font-bold"
                                        onClick={() => updateQuantity(item.id, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Customer Info Form */}
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Pemesan</Label>
                    <Input
                        id="name"
                        placeholder="Masukkan nama Anda..."
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-neutral-50 dark:bg-neutral-800"
                    />
                </div>
            </div>

            {/* Footer Total & Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 w-full max-w-md mx-auto z-10">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-neutral-500">Total Pembayaran</span>
                    <span className="text-xl font-bold">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice)}
                    </span>
                </div>
                <Button
                    className="w-full h-12 text-lg font-bold rounded-xl"
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Memproses...
                        </>
                    ) : (
                        'Pesan Sekarang'
                    )}
                </Button>
            </div>
        </div>
    );
}

function ShoppingBagIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    )
}
