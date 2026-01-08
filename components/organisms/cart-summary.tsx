// ============================================
// RESTAUS - Cart Summary Component (Organism)
// ============================================

'use client';

import { CartItem } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Trash2, Edit2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface CartSummaryProps {
    items: CartItem[];
    onUpdateQuantity?: (index: number, quantity: number) => void;
    onUpdateNotes?: (index: number, notes: string) => void;
    onRemoveItem?: (index: number) => void;
    onSubmit?: () => void;
    isSubmitting?: boolean;
    className?: string;
}

export function CartSummary({
    items,
    onUpdateQuantity,
    onUpdateNotes,
    onRemoveItem,
    onSubmit,
    isSubmitting,
    className,
}: CartSummaryProps) {
    const [editingNotes, setEditingNotes] = useState<number | null>(null);
    const [notesValue, setNotesValue] = useState('');

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const handleEditNotes = (index: number, currentNotes?: string) => {
        setEditingNotes(index);
        setNotesValue(currentNotes || '');
    };

    const handleSaveNotes = (index: number) => {
        onUpdateNotes?.(index, notesValue);
        setEditingNotes(null);
        setNotesValue('');
    };

    if (items.length === 0) {
        return (
            <Card className={className}>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-center">
                        Your cart is empty
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 text-center mt-2">
                        Add items from the menu to get started
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart ({itemCount} items)
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <ScrollArea className="h-[400px] px-6">
                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                            {item.menu.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Rp {item.menu.price.toLocaleString('id-ID')} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            Rp {item.subtotal.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onUpdateQuantity?.(index, item.quantity - 1)}
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-sm font-medium w-8 text-center">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onUpdateQuantity?.(index, item.quantity + 1)}
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 ml-auto text-blue-600"
                                        onClick={() => handleEditNotes(index, item.special_notes)}
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600"
                                        onClick={() => onRemoveItem?.(index)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>

                                {/* Notes Display/Edit */}
                                {editingNotes === index ? (
                                    <div className="space-y-2">
                                        <Label htmlFor={`notes-${index}`} className="text-xs">
                                            Special Notes
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id={`notes-${index}`}
                                                value={notesValue}
                                                onChange={(e) => setNotesValue(e.target.value)}
                                                placeholder="e.g., No spicy, extra sauce..."
                                                className="h-8 text-sm"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleSaveNotes(index)}
                                                className="h-8"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : item.special_notes ? (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                        Note: {item.special_notes}
                                    </p>
                                ) : null}

                                <Separator />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="flex-col gap-4">
                <div className="w-full space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold text-2xl text-orange-600">
                            Rp {total.toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || items.length === 0}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-lg font-semibold"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </Button>
            </CardFooter>
        </Card>
    );
}
