// ============================================
// RESTAUS - Menu List Page (Admin)
// ============================================

'use client';

import { useState } from 'react';
import { useMenus, useDeleteMenu, useToggleMenuStatus } from '@/hooks/use-menus';
import { MenuTable } from '@/components/organisms/menu-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Menu } from '@/types';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminMenusPage() {
    const { data: menus = [], isLoading } = useMenus();
    const deleteMenu = useDeleteMenu();
    const toggleMenuStatus = useToggleMenuStatus();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logic
    const filteredMenus = menus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (menu: Menu) => {
        toast.info(`Edit ${menu.name} - Feature coming soon`);
        // Will open modal/sheet
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
                <Button className="bg-orange-600 hover:bg-orange-700">
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
                            <Button variant="outline" size="sm" className="h-9">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
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
        </div>
    );
}
