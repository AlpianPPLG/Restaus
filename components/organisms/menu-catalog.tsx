// ============================================
// RESTAUS - Menu Catalog Component (Organism)
// ============================================

'use client';

import { useState } from 'react';
import { Menu, Category } from '@/types';
import { MenuItemCard } from '@/components/molecules/menu-item-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Loader2 } from 'lucide-react';

interface MenuCatalogProps {
    menus: Menu[];
    categories: Category[];
    isLoading?: boolean;
    quantities?: Record<number, number>;
    onQuantityChange?: (menuId: number, quantity: number) => void;
    onAddToCart?: (menu: Menu) => void;
}

export function MenuCatalog({
    menus,
    categories,
    isLoading,
    quantities = {},
    onQuantityChange,
    onAddToCart,
}: MenuCatalogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

    // Filter menus
    const filteredMenus = menus.filter((menu) => {
        const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            menu.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || menu.category_id === selectedCategory;
        return matchesSearch && matchesCategory && menu.is_active;
    });

    // Group by category
    const menusByCategory = categories.map((category) => ({
        category,
        menus: filteredMenus.filter((menu) => menu.category_id === category.id),
    }));

    const handleAdd = (menuId: number) => {
        const currentQty = quantities[menuId] || 0;
        onQuantityChange?.(menuId, currentQty + 1);
    };

    const handleRemove = (menuId: number) => {
        const currentQty = quantities[menuId] || 0;
        if (currentQty > 0) {
            onQuantityChange?.(menuId, currentQty - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                />
            </div>

            {/* Category Tabs */}
            <Tabs
                value={selectedCategory.toString()}
                onValueChange={(value) => setSelectedCategory(value === 'all' ? 'all' : parseInt(value))}
                className="w-full"
            >
                <TabsList className="w-full justify-start overflow-x-auto">
                    <TabsTrigger value="all" className="px-6">
                        All Items
                    </TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger key={category.id} value={category.id.toString()} className="px-6">
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* All Items */}
                <TabsContent value="all" className="mt-6">
                    {menusByCategory.map(({ category, menus: categoryMenus }) => (
                        categoryMenus.length > 0 && (
                            <div key={category.id} className="mb-8">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    {category.name}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {categoryMenus.map((menu) => (
                                        <MenuItemCard
                                            key={menu.id}
                                            menu={menu}
                                            quantity={quantities[menu.id] || 0}
                                            onAdd={() => handleAdd(menu.id)}
                                            onRemove={() => handleRemove(menu.id)}
                                            onAddToCart={() => onAddToCart?.(menu)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    ))}

                    {filteredMenus.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400">
                                No menu items found
                            </p>
                        </div>
                    )}
                </TabsContent>

                {/* Category-specific tabs */}
                {categories.map((category) => (
                    <TabsContent key={category.id} value={category.id.toString()} className="mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredMenus
                                .filter((menu) => menu.category_id === category.id)
                                .map((menu) => (
                                    <MenuItemCard
                                        key={menu.id}
                                        menu={menu}
                                        quantity={quantities[menu.id] || 0}
                                        onAdd={() => handleAdd(menu.id)}
                                        onRemove={() => handleRemove(menu.id)}
                                        onAddToCart={() => onAddToCart?.(menu)}
                                    />
                                ))}
                        </div>

                        {filteredMenus.filter((menu) => menu.category_id === category.id).length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400">
                                    No items in this category
                                </p>
                            </div>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
