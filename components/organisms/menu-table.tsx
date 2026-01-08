// ============================================
// RESTAUS - Menu Table Component
// ============================================

'use client';

import { Menu } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface MenuTableProps {
    menus: Menu[];
    isLoading?: boolean;
    onEdit: (menu: Menu) => void;
    onDelete: (menuId: number) => void;
    onToggleStatus: (menuId: number, currentStatus: boolean) => void;
}

export function MenuTable({
    menus,
    isLoading,
    onEdit,
    onDelete,
    onToggleStatus
}: MenuTableProps) {

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading menus...</div>;
    }

    if (menus.length === 0) {
        return <div className="p-8 text-center text-gray-500">No menus found.</div>;
    }

    return (
        <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {menus.map((menu) => (
                        <TableRow key={menu.id}>
                            <TableCell className="font-medium text-gray-500">#{menu.id}</TableCell>
                            <TableCell>
                                <div className="font-medium">{menu.name}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                    {menu.description}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline">{menu.category?.name || 'Uncategorized'}</Badge>
                            </TableCell>
                            <TableCell>
                                Rp {menu.price.toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell>
                                <div className={`font-medium ${(menu.inventory?.remaining_stock || 0) < 5 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                    {menu.inventory?.remaining_stock || 0}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={menu.is_active}
                                        onCheckedChange={() => onToggleStatus(menu.id, menu.is_active)}
                                    />
                                    <span className="text-xs text-gray-500">
                                        {menu.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(menu)}
                                        className="h-8 w-8"
                                    >
                                        <Edit2 className="w-4 h-4 text-blue-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(menu.id)}
                                        className="h-8 w-8"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
