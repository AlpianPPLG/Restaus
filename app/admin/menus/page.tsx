// ============================================
// RESTAUS - Menu List Page (Admin)
// ============================================

'use client';

import { useState } from 'react';
import { useMenus, useDeleteMenu, useToggleMenuStatus, useCategories } from '@/hooks/use-menus';
import { MenuTable } from '@/components/organisms/menu-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Menu } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MenuFormDialog } from '@/components/organisms/menu-form-dialog';

export default function AdminMenusPage() {
    const { data: menus = [], isLoading } = useMenus();
    const { data: categories = [] } = useCategories();
    const deleteMenu = useDeleteMenu();
    const toggleMenuStatus = useToggleMenuStatus();

    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

    // Filter logic
    const filteredMenus = menus.filter(menu => {
        const matchesSearch = menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            menu.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || menu.category_id.toString() === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleCreate = () => {
        setSelectedMenu(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (menu: Menu) => {
        setSelectedMenu(menu);
        setIsDialogOpen(true);
    };

    const handleDelete = async (menuId: number) => {
        if (confirm('Are you sure you want to delete this menu?')) {
            try {
                await deleteMenu.mutateAsync(menuId);
                toast.success('Menu deleted successfully');
            } catch (error) {
                // error handled by hook
            }
        }
    };

    const handleToggleStatus = async (menuId: number, currentStatus: boolean) => {
        try {
            await toggleMenuStatus.mutateAsync({ id: menuId, is_active: !currentStatus });
            toast.success(`Menu ${!currentStatus ? 'activated' : 'deactivated'}`);
        } catch (error) {
            // error handled by hook
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Menu Management</h1>
                    <p className="text-gray-500">Manage your restaurant menu items and inventory.</p>
                </div>
                <Button onClick={handleCreate} className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Menu
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center justify-between">
                        <span>Menu Items</span>
                        <div className="flex items-center gap-2">
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search menus..."
                                    className="pl-8 h-9"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[150px] h-9">
                                    <div className="flex items-center">
                                        <Filter className="w-4 h-4 mr-2 text-gray-500" />
                                        <SelectValue placeholder="All Categories" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <MenuTable
                        menus={filteredMenus}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                    />
                </CardContent>
            </Card>

            <MenuFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                menuToEdit={selectedMenu}
            />
        </div>
    );
}
