// ============================================
// RESTAUS - Shopping Cart Hook
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, Menu } from '@/types';
import { STORAGE_KEYS } from '@/constants';
import { toast } from 'sonner';

const EMPTY_CART: Cart = {
    items: [],
    total: 0,
};

export function useCart() {
    const [cart, setCart] = useState<Cart>(EMPTY_CART);

    // Load cart from localStorage on mount
    useEffect(() => {
        const loadCart = () => {
            try {
                const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
                if (savedCart) {
                    const parsedCart = JSON.parse(savedCart) as Cart;
                    setCart(parsedCart);
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
                localStorage.removeItem(STORAGE_KEYS.CART);
            }
        };

        loadCart();
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (cart.items.length > 0 || cart.total > 0) {
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        } else {
            localStorage.removeItem(STORAGE_KEYS.CART);
        }
    }, [cart]);

    // Calculate total
    const calculateTotal = useCallback((items: CartItem[]) => {
        return items.reduce((sum, item) => sum + item.subtotal, 0);
    }, []);

    // Add item to cart
    const addItem = useCallback((menu: Menu, quantity = 1, special_notes?: string) => {
        setCart((prevCart) => {
            // Check if item already exists
            const existingItemIndex = prevCart.items.findIndex(
                (item) => item.menu.id === menu.id && item.special_notes === special_notes
            );

            let newItems: CartItem[];

            if (existingItemIndex >= 0) {
                // Update existing item
                newItems = [...prevCart.items];
                const existingItem = newItems[existingItemIndex];
                const newQuantity = existingItem.quantity + quantity;
                newItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: newQuantity,
                    subtotal: newQuantity * menu.price,
                };
            } else {
                // Add new item
                const newItem: CartItem = {
                    menu,
                    quantity,
                    special_notes,
                    subtotal: quantity * menu.price,
                };
                newItems = [...prevCart.items, newItem];
            }

            const newTotal = calculateTotal(newItems);

            toast.success(`Added ${menu.name} to cart`);

            return {
                items: newItems,
                total: newTotal,
            };
        });
    }, [calculateTotal]);

    // Update item quantity
    const updateQuantity = useCallback((index: number, quantity: number) => {
        if (quantity < 1) {
            removeItem(index);
            return;
        }

        setCart((prevCart) => {
            const newItems = [...prevCart.items];
            const item = newItems[index];
            newItems[index] = {
                ...item,
                quantity,
                subtotal: quantity * item.menu.price,
            };

            const newTotal = calculateTotal(newItems);

            return {
                items: newItems,
                total: newTotal,
            };
        });
    }, [calculateTotal]);

    // Remove item from cart
    const removeItem = useCallback((index: number) => {
        setCart((prevCart) => {
            const newItems = prevCart.items.filter((_, i) => i !== index);
            const newTotal = calculateTotal(newItems);

            toast.success('Item removed from cart');

            return {
                items: newItems,
                total: newTotal,
            };
        });
    }, [calculateTotal]);

    // Update item notes
    const updateNotes = useCallback((index: number, special_notes: string) => {
        setCart((prevCart) => {
            const newItems = [...prevCart.items];
            newItems[index] = {
                ...newItems[index],
                special_notes,
            };

            return {
                ...prevCart,
                items: newItems,
            };
        });
    }, []);

    // Clear cart
    const clearCart = useCallback(() => {
        setCart(EMPTY_CART);
        localStorage.removeItem(STORAGE_KEYS.CART);
        toast.success('Cart cleared');
    }, []);

    // Get cart summary
    const getCartSummary = useCallback(() => {
        const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        return {
            itemCount,
            total: cart.total,
            isEmpty: cart.items.length === 0,
        };
    }, [cart]);

    return {
        cart,
        addItem,
        updateQuantity,
        removeItem,
        updateNotes,
        clearCart,
        getCartSummary,
    };
}
