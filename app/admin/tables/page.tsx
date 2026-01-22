// ============================================
// RESTAUS - Admin Tables Page
// ============================================

'use client';

import { useState } from 'react';
import { useTables, useCreateTable, useDeleteTable } from '@/hooks/use-tables';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, QrCode, Edit2, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateTable, useUpdateTableStatus } from '@/hooks/use-tables';

export default function AdminTablesPage() {
    const { data: tables = [], isLoading } = useTables();
    const createTableMutation = useCreateTable();
    const deleteTableMutation = useDeleteTable();
    const updateTableMutation = useUpdateTable();
    const updateStatusMutation = useUpdateTableStatus();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState<any>(null);

    const [newTableNumber, setNewTableNumber] = useState('');
    const [newTableCapacity, setNewTableCapacity] = useState('4');

    const [editTableNumber, setEditTableNumber] = useState('');
    const [editTableCapacity, setEditTableCapacity] = useState('4');

    const handleCreateTable = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTableMutation.mutateAsync({
                table_number: newTableNumber,
                capacity: parseInt(newTableCapacity)
            });
            toast.success('Table created successfully');
            setIsCreateOpen(false);
            setNewTableNumber('');
            setNewTableCapacity('4');
        } catch (error) {
            toast.error('Failed to create table');
        }
    };

    const handleEditTable = (table: any) => {
        setSelectedTable(table);
        setEditTableNumber(table.table_number);
        setEditTableCapacity(table.capacity.toString());
        setIsEditOpen(true);
    };

    const handleUpdateTable = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTable) return;
        try {
            await updateTableMutation.mutateAsync({
                tableId: selectedTable.id,
                data: {
                    table_number: editTableNumber,
                    capacity: parseInt(editTableCapacity)
                }
            });
            toast.success('Table updated successfully');
            setIsEditOpen(false);
        } catch (error) {
            toast.error('Failed to update table');
        }
    };

    const handleDeleteTable = async (id: number) => {
        if (confirm('Are you sure you want to delete this table?')) {
            try {
                await deleteTableMutation.mutateAsync(id);
                toast.success('Table deleted successfully');
            } catch (error) {
                toast.error('Failed to delete table');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Tables</h1>
                    <p className="text-gray-500">Manage restaurant tables and generate QR codes.</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Table
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Table</DialogTitle>
                                <DialogDescription>
                                    Create a new table for your restaurant.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreateTable}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="number" className="text-right">
                                            Number
                                        </Label>
                                        <Input
                                            id="number"
                                            value={newTableNumber}
                                            onChange={(e) => setNewTableNumber(e.target.value)}
                                            className="col-span-3"
                                            placeholder="T01"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="capacity" className="text-right">
                                            Capacity
                                        </Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            value={newTableCapacity}
                                            onChange={(e) => setNewTableCapacity(e.target.value)}
                                            className="col-span-3"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={createTableMutation.isPending}>
                                        {createTableMutation.isPending ? 'Creating...' : 'Create Table'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Table</DialogTitle>
                                <DialogDescription>
                                    Update table information.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleUpdateTable}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-number" className="text-right">
                                            Number
                                        </Label>
                                        <Input
                                            id="edit-number"
                                            value={editTableNumber}
                                            onChange={(e) => setEditTableNumber(e.target.value)}
                                            className="col-span-3"
                                            placeholder="T01"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="edit-capacity" className="text-right">
                                            Capacity
                                        </Label>
                                        <Input
                                            id="edit-capacity"
                                            type="number"
                                            value={editTableCapacity}
                                            onChange={(e) => setEditTableCapacity(e.target.value)}
                                            className="col-span-3"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={updateTableMutation.isPending}>
                                        {updateTableMutation.isPending ? 'Updating...' : 'Update Table'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Tables</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        Loading tables...
                                    </TableCell>
                                </TableRow>
                            ) : tables.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No tables found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tables.map((table) => (
                                    <TableRow key={table.id}>
                                        <TableCell className="font-medium">{table.table_number}</TableCell>
                                        <TableCell>{table.capacity} Seats</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={table.status === 'available' ? 'outline' : 'default'}
                                                className={
                                                    table.status === 'available'
                                                        ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100'
                                                        : table.status === 'occupied'
                                                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                                }
                                            >
                                                {table.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Set Available (Clear Table)"
                                                    onClick={() => updateStatusMutation.mutate({ tableId: table.id, status: 'available' })}
                                                    disabled={table.status === 'available'}
                                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                                                >
                                                    <RotateCw className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Edit Table"
                                                    onClick={() => handleEditTable(table)}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Print QR Code">
                                                    <QrCode className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDeleteTable(table.id)}
                                                    disabled={table.status !== 'available'}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

