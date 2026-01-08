// ============================================
// RESTAUS - Menu Item Card Component (Molecule)
// ============================================

'use client';

import { Menu } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface MenuItemCardProps {
    menu: Menu;
    quantity?: number;
    onAdd?: () => void;
    onRemove?: () => void;
    onAddToCart?: () => void;
    className?: string;
}

export function MenuItemCard({
    menu,
    quantity = 0,
    onAdd,
    onRemove,
    onAddToCart,
    className,
}: MenuItemCardProps) {
    const isOutOfStock = menu.inventory && menu.inventory.remaining_stock <= 0;
    const isLowStock = menu.inventory && menu.inventory.remaining_stock > 0 && menu.inventory.remaining_stock <= 5;

    return (
        <Card
            className={cn(
                'overflow-hidden transition-all duration-300 hover:shadow-lg group',
                isOutOfStock && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 overflow-hidden">
                {menu.image_url ? (
                    <Image
                        src={menu.image_url}
                        alt={menu.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingCart className="w-16 h-16 text-gray-400" />
                    </div>
                )}

                {/* Stock Badge */}
                {isOutOfStock && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="destructive" className="font-semibold">
                            Out of Stock
                        </Badge>
                    </div>
                )}
                {isLowStock && !isOutOfStock && (
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-yellow-500 text-white">
                            Low Stock ({menu.inventory?.remaining_stock})
                        </Badge>
                    </div>
                )}

                {/* Price Tag */}
                <div className="absolute bottom-2 left-2">
                    <div className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white font-bold">
                            Rp {menu.price.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>

            <CardContent className="p-4">
                {/* Name */}
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {menu.name}
                </h3>

                {/* Description */}
                {menu.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {menu.description}
                    </p>
                )}

                {/* Stock Info */}
                {menu.inventory && !isOutOfStock && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Stock: {menu.inventory.remaining_stock} available</span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
                {isOutOfStock ? (
                    <Button disabled className="w-full" variant="secondary">
                        Out of Stock
                    </Button>
                ) : quantity > 0 ? (
                    <div className="flex items-center gap-2 w-full">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onRemove}
                            className="h-10 w-10"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {quantity}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onAdd}
                            className="h-10 w-10"
                            disabled={menu.inventory ? quantity >= menu.inventory.remaining_stock : false}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={onAddToCart || onAdd}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Cart
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
