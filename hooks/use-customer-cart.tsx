'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export type CartItem = {
    id: string; // unique id for cart item (e.g. menuId + variants)
    menuId: number;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    notes?: string;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'id'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CustomerCartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('restaus_customer_cart'); // Changed storage key too for safety
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
        setMounted(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('restaus_customer_cart', JSON.stringify(items));
        }
    }, [items, mounted]);

    const addItem = (newItem: Omit<CartItem, 'id'>) => {
        setItems((prev) => {
            // Check if same item exists (same menuId AND same notes)
            const existing = prev.find(
                (i) => i.menuId === newItem.menuId && i.notes === newItem.notes
            );

            if (existing) {
                toast.success(`Updated quantity for ${newItem.name}`);
                return prev.map((i) =>
                    i.id === existing.id
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }

            toast.success(`${newItem.name} added to cart`);
            return [...prev, { ...newItem, id: crypto.randomUUID() }];
        });
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((i) => {
                if (i.id === id) {
                    const newQty = Math.max(0, i.quantity + delta);
                    return { ...i, quantity: newQty };
                }
                return i;
            }).filter((i) => i.quantity > 0)
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
    const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCustomerCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCustomerCart must be used within a CustomerCartProvider');
    }
    return context;
}
