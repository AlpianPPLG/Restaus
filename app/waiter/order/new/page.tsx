// ============================================
// RESTAUS - New Order Page (Waiter)
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useTable } from '@/hooks/use-tables';
import { useMenus } from '@/hooks/use-menus';
import { useCategories } from '@/hooks/use-menus';
import { useCreateOrder } from '@/hooks/use-orders';
import { MenuCatalog } from '@/components/organisms/menu-catalog';
import { CartSummary } from '@/components/organisms/cart-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { Menu, CartItem, OrderFormData } from '@/types';
import { toast } from 'sonner';

export default function NewOrderPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tableId = searchParams.get('table');

    const { requireAuth } = useAuth();
    const { data: table } = useTable(parseInt(tableId || '0'));
    const { data: menus = [], isLoading: menusLoading } = useMenus({ is_active: true, in_stock: true });
    const { data: categories = [] } = useCategories();
    const createOrder = useCreateOrder();

    const [cart, setCart] = useState<CartItem[]>([]);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    useEffect(() => {
        requireAuth(['waiter', 'admin']);
    }, [requireAuth]);

    useEffect(() => {
        if (!tableId) {
            toast.error('Table ID is required');
            router.push('/waiter');
        }
    }, [tableId, router]);

    const handleQuantityChange = (menuId: number, quantity: number) => {
        if (quantity <= 0) {
            // Remove from quantities
            const newQuantities = { ...quantities };
            delete newQuantities[menuId];
            setQuantities(newQuantities);

            // Remove from cart
            setCart(cart.filter(item => item.menu.id !== menuId));
        } else {
            setQuantities({ ...quantities, [menuId]: quantity });

            // Update cart
            const menu = menus.find(m => m.id === menuId);
            if (menu) {
                const existingIndex = cart.findIndex(item => item.menu.id === menuId);
                if (existingIndex >= 0) {
                    const newCart = [...cart];
                    newCart[existingIndex] = {
                        ...newCart[existingIndex],
                        quantity,
                        subtotal: quantity * menu.price,
                    };
                    setCart(newCart);
                } else {
                    setCart([...cart, {
                        menu,
                        quantity,
                        subtotal: quantity * menu.price,
                        special_notes: '',
                    }]);
                }
            }
        }
    };

    const handleAddToCart = (menu: Menu) => {
        handleQuantityChange(menu.id, 1);
        toast.success(`${menu.name} added to cart`);
    };

    const handleUpdateCartQuantity = (index: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(index);
        } else {
            const newCart = [...cart];
            newCart[index] = {
                ...newCart[index],
                quantity,
                subtotal: quantity * newCart[index].menu.price,
            };
            setCart(newCart);
            setQuantities({ ...quantities, [newCart[index].menu.id]: quantity });
        }
    };

    const handleUpdateNotes = (index: number, notes: string) => {
        const newCart = [...cart];
        newCart[index] = {
            ...newCart[index],
            special_notes: notes,
        };
        setCart(newCart);
        toast.success('Notes updated');
    };

    const handleRemoveItem = (index: number) => {
        const item = cart[index];
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);

        const newQuantities = { ...quantities };
        delete newQuantities[item.menu.id];
        setQuantities(newQuantities);

        toast.success('Item removed from cart');
    };

    const handleSubmitOrder = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        if (!tableId) {
            toast.error('Table ID is missing');
            return;
        }

        const orderData: OrderFormData = {
            table_id: parseInt(tableId),
            order_type: 'dine_in',
            items: cart.map(item => ({
                menu_id: item.menu.id,
                quantity: item.quantity,
                special_notes: item.special_notes || undefined,
            })),
        };

        try {
            await createOrder.mutateAsync(orderData);
            toast.success('Order submitted successfully!');
            router.push('/waiter');
        } catch (error) {
            console.error('Order submission error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/waiter')}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                                <UtensilsCrossed className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    New Order
                                </h1>
                                {table && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Table {table.table_number} • Capacity: {table.capacity}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Menu Catalog - 2/3 width */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Menu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MenuCatalog
                                    menus={menus}
                                    categories={categories}
                                    isLoading={menusLoading}
                                    quantities={quantities}
                                    onQuantityChange={handleQuantityChange}
                                    onAddToCart={handleAddToCart}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cart Summary - 1/3 width, sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <CartSummary
                                items={cart}
                                onUpdateQuantity={handleUpdateCartQuantity}
                                onUpdateNotes={handleUpdateNotes}
                                onRemoveItem={handleRemoveItem}
                                onSubmit={handleSubmitOrder}
                                isSubmitting={createOrder.isPending}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
