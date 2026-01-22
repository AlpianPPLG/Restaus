'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Category, Menu } from '@/types';
import { useCustomerCart } from '@/hooks/use-customer-cart';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Search, ShoppingBag, Trash2, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

interface MenuViewProps {
    categories: Category[];
    menus: Menu[];
    tableId?: string;
}

export function MenuView({ categories, menus, tableId }: MenuViewProps) {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [qty, setQty] = useState(1);
    const [notes, setNotes] = useState('');

    const { items, addItem, removeItem, updateQuantity, totalPrice, clearCart } = useCustomerCart();

    const filteredMenus = menus.filter(m =>
        m.is_active &&
        (activeCategory === 0 || m.category_id === activeCategory) &&
        (searchQuery === '' || m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAddToCart = (menu: Menu, quantity: number, specialNotes: string) => {
        addItem({
            menuId: menu.id,
            name: menu.name,
            price: menu.price,
            quantity: quantity,
            image_url: menu.image_url,
            notes: specialNotes
        });
        setQty(1);
        setNotes('');
        setSelectedMenu(null);
    };

    const handleOpenDetail = (menu: Menu) => {
        setSelectedMenu(menu);
        setQty(1);
        setNotes('');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-black">
            {/* LEFT AREA: Menu Catalog */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header: Search & Categories */}
                <header className="bg-white dark:bg-neutral-900 border-b dark:border-neutral-800 p-4 shrink-0 z-20 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                                <span className="font-bold text-white dark:text-black">R</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight">Restaus Menu</h1>
                        </div>
                        <div className="relative w-full md:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <Input
                                placeholder="Cari menu favorit..."
                                className="pl-9 pr-8 bg-slate-100 dark:bg-neutral-800 border-none rounded-xl h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory(0)}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border",
                                activeCategory === 0
                                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md transform scale-105"
                                    : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                            )}
                        >
                            Semua Menu
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border",
                                    activeCategory === cat.id
                                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-md transform scale-105"
                                        : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Content: Grid Menu */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 lg:pb-6 custom-scrollbar">
                    {filteredMenus.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                            <Search className="w-12 h-12 mb-2 opacity-20" />
                            <p>Menu tidak ditemukan</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                            {filteredMenus.map(menu => {
                                // Stock Logic
                                const stock = menu.inventory?.remaining_stock ?? 0;
                                const isOut = stock <= 0;
                                const isLow = stock > 0 && stock < 5;

                                return (
                                    <div
                                        key={menu.id}
                                        onClick={() => !isOut && handleOpenDetail(menu)}
                                        className={cn(
                                            "group bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-all duration-300 overflow-hidden flex flex-col relative",
                                            isOut ? "opacity-60 cursor-not-allowed" : "hover:shadow-xl hover:border-black/5 dark:hover:border-white/10 cursor-pointer"
                                        )}
                                    >
                                        {/* Image Area */}
                                        <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
                                            {isOut && (
                                                <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center">
                                                    <Badge variant="destructive" className="text-white font-bold px-3 py-1 text-sm bg-red-600 hover:bg-red-700">HABIS</Badge>
                                                </div>
                                            )}
                                            {isLow && !isOut && (
                                                <Badge className="absolute top-2 left-2 z-10 bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-md">
                                                    Sisa {stock}
                                                </Badge>
                                            )}

                                            {menu.image_url ? (
                                                <Image
                                                    src={menu.image_url}
                                                    alt={menu.name}
                                                    fill
                                                    className={cn(
                                                        "object-cover transition-transform duration-500",
                                                        !isOut && "group-hover:scale-110"
                                                    )}
                                                    sizes="(max-width: 768px) 100px, 300px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 transition-colors">
                                                    <span className="text-xs font-medium">No Image</span>
                                                </div>
                                            )}
                                            {/* Overlay Add Button */}
                                            {!isOut && (
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="bg-white dark:bg-black p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                        <Plus className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-neutral-900 dark:text-neutral-50 line-clamp-2 md:text-lg leading-snug">{menu.name}</h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 h-8">{menu.description || 'Enak dan lezat.'}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-50 dark:border-neutral-800">
                                                <span className="font-bold text-lg text-primary">
                                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(menu.price)}
                                                </span>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 rounded-full border border-neutral-200 hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isOut}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDEBAR: Desktop Cart (Hidden on mobile) */}
            <aside className="hidden lg:flex w-96 flex-col bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-xl z-30">
                <div className="p-5 border-b dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Pesanan {tableId ? `#${tableId}` : ''}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">Pastikan pesanan Anda sudah benar.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h3 className="font-bold text-neutral-700 dark:text-neutral-300">Keranjang Kosong</h3>
                            <p className="text-sm text-neutral-500 max-w-[200px] mt-2">Silakan pilih menu dari daftar di sebelah kiri.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-3 bg-white dark:bg-black border border-neutral-100 dark:border-neutral-800 p-3 rounded-xl shadow-sm hover:border-neutral-300 transition-colors group">
                                    <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg relative overflow-hidden flex-shrink-0">
                                        {item.image_url ? (
                                            <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">IMG</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-sm truncate pr-2">{item.name}</h4>
                                            <button onClick={() => removeItem(item.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {item.notes && <p className="text-[10px] text-neutral-500 mb-2 italic line-clamp-1">"{item.notes}"</p>}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                                                {new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                                            </span>
                                            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 h-7">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-5 flex justify-center text-neutral-500 hover:text-black font-bold">-</button>
                                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-5 flex justify-center text-neutral-500 hover:text-black font-bold">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-5 border-t dark:border-neutral-800 bg-neutral-50 dark:bg-black">
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Subtotal</span>
                            <span className="font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">Pajak (10%)</span>
                            <span className="font-semibold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice * 0.1)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-extrabold">
                            <span>Total</span>
                            <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice * 1.1)}</span>
                        </div>
                    </div>
                    <Button
                        size="lg"
                        className="w-full rounded-xl font-bold text-md h-12"
                        disabled={items.length === 0}
                        onClick={() => router.push(`/cart?table=${tableId || ''}`)}
                    >
                        Checkout Now <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </aside>

            {/* MOBILE FLOATING CART (Only on small screens) */}
            <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
                {items.length > 0 && (
                    <div
                        onClick={() => router.push(`/cart?table=${tableId || ''}`)}
                        className="bg-black text-white dark:bg-white dark:text-black p-4 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer animate-in slide-in-from-bottom"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                                {items.reduce((a, b) => a + b.quantity, 0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs opacity-80">Total Pesanan</span>
                                <span className="font-bold text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 font-bold px-3 py-1.5 bg-white/10 rounded-lg">
                            Lihat Cart <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>

            {/* DETAIL DRAWER (Shared) */}
            <Drawer open={!!selectedMenu} onOpenChange={(open) => !open && setSelectedMenu(null)}>
                <DrawerContent className="max-w-md mx-auto">
                    {selectedMenu && (
                        <div className="p-4 space-y-6">
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex-shrink-0 relative overflow-hidden">
                                    {selectedMenu.image_url && (
                                        <Image src={selectedMenu.image_url} alt={selectedMenu.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <DrawerTitle className="text-xl font-bold">{selectedMenu.name}</DrawerTitle>
                                    <DrawerDescription className="mt-2 text-neutral-500 text-sm">
                                        {selectedMenu.description}
                                    </DrawerDescription>
                                    <p className="mt-2 font-bold text-lg text-primary">
                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedMenu.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Catatan (Opsional)</label>
                                <Input
                                    placeholder="Contoh: Jangan terlalu pedas..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-neutral-50"
                                />
                            </div>

                            <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 p-4 rounded-2xl">
                                <span className="font-medium">Jumlah Porsi</span>
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}>
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="font-bold w-6 text-center text-lg">{qty}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-10 w-10 rounded-full"
                                        onClick={() => setQty(Math.min((selectedMenu.inventory?.remaining_stock || 10), qty + 1))}
                                        disabled={qty >= (selectedMenu.inventory?.remaining_stock || 0)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="text-xs text-neutral-400 text-right px-4">
                                Stok tersedia: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{selectedMenu.inventory?.remaining_stock ?? 0}</span>
                            </div>

                            <DrawerFooter className="px-0">
                                <Button
                                    className="w-full rounded-2xl py-7 text-lg font-bold shadow-lg shadow-primary/20"
                                    onClick={() => handleAddToCart(selectedMenu, qty, notes)}
                                >
                                    Tambah - {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(selectedMenu.price * qty)}
                                </Button>
                            </DrawerFooter>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
