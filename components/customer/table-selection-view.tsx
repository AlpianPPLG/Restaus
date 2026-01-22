'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Armchair, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface TableSelectionViewProps {
    tables: Table[];
}

export function TableSelectionView({ tables }: TableSelectionViewProps) {
    const router = useRouter();
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [guestCount, setGuestCount] = useState<number>(2);
    const [customerName, setCustomerName] = useState<string>('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleTableClick = (table: Table) => {
        if (table.status !== 'available') return;
        setSelectedTable(table);
        setGuestCount(2); // Default
        setIsDialogOpen(true);
    };

    const handleConfirm = () => {
        if (!selectedTable) return;

        // Redirect to menu with table info
        // We can pass guest count and name as query params or store in local storage
        // using query params for stateless simplicity
        const params = new URLSearchParams();
        params.set('table', selectedTable.id.toString());
        if (customerName) params.set('name', customerName);
        if (guestCount) params.set('pax', guestCount.toString());

        // Also save to localStorage for persistence
        if (typeof window !== 'undefined') {
            localStorage.setItem('restaus_session', JSON.stringify({
                tableId: selectedTable.id,
                tableName: selectedTable.table_number,
                customerName,
                guestCount
            }));
        }

        router.push(`/menu?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-2 mt-10">
                    <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <span className="font-bold text-3xl text-white dark:text-black">R</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Selamat Datang di Restaus</h1>
                    <p className="text-slate-500 dark:text-slate-400">Silakan pilih meja Anda untuk memulai pesanan</p>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 text-sm font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-300 dark:bg-slate-800 dark:border-slate-600"></div>
                        <span>Tersedia</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-slate-200"></div>
                        <span className="text-slate-400">Terisi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-black dark:bg-white"></div>
                        <span>Dipilih</span>
                    </div>
                </div>

                {/* Grid Tables */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8">
                    {tables.map((table) => {
                        const isAvailable = table.status === 'available';
                        const isSelected = selectedTable?.id === table.id;

                        return (
                            <button
                                key={table.id}
                                disabled={!isAvailable}
                                onClick={() => handleTableClick(table)}
                                className={cn(
                                    "relative h-32 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 group",
                                    isAvailable
                                        ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-black dark:hover:border-white hover:shadow-lg cursor-pointer"
                                        : "bg-slate-100 dark:bg-slate-950 border-transparent opacity-60 cursor-not-allowed",
                                    isSelected && "border-black dark:border-white ring-2 ring-black dark:ring-white ring-offset-2 bg-slate-50 dark:bg-slate-800"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                    isAvailable ? "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700" : "bg-slate-200 dark:bg-slate-900",
                                    isSelected && "bg-black text-white dark:bg-white dark:text-black"
                                )}>
                                    <Armchair className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <span className={cn(
                                        "block text-lg font-bold",
                                        !isAvailable && "text-slate-400"
                                    )}>Meja {table.table_number}</span>
                                    <span className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                        <Users className="w-3 h-3" /> {table.capacity} Orang
                                    </span>
                                </div>
                                {!isAvailable && (
                                    <div className="absolute top-3 right-3 text-red-500">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                )}
                                {isSelected && (
                                    <div className="absolute top-3 right-3 text-black dark:text-white">
                                        <CheckCircle2 className="w-5 h-5 fill-current" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selection Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detail Pengunjung</DialogTitle>
                        <DialogDescription>
                            Lengkapi data untuk Meja {selectedTable?.table_number}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Berapa Orang?</label>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                >
                                    -
                                </Button>
                                <div className="flex-1 text-center font-bold text-2xl">
                                    {guestCount}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setGuestCount(Math.min(selectedTable?.capacity || 10, guestCount + 1))}
                                >
                                    +
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 text-center">
                                Kapasitas Maks: {selectedTable?.capacity} Orang
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nama Pemesan (Opsional)</label>
                            <Input
                                placeholder="Contoh: Budi"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button className="w-full h-12 text-lg font-bold" onClick={handleConfirm}>
                            Mulai Pesan <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
