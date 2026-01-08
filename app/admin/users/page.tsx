// ============================================
// RESTAUS - Admin Users Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { UserRole } from '@/types';
import { UserPlus, Loader2, Shield, User as UserIcon, ChefHat, Coffee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface UserData {
    id: number;
    username: string;
    full_name: string;
    role: UserRole;
    created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        role: 'waiter' as UserRole
    });

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<UserData[]>('/api/users');
            if (res.success && res.data) {
                setUsers(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await api.post('/api/auth/register', formData);
            if (res.success) {
                toast.success('User created successfully');
                setIsCreateOpen(false);
                setFormData({
                    username: '',
                    password: '',
                    full_name: '',
                    role: 'waiter'
                });
                fetchUsers(); // Refresh list
            } else {
                toast.error(res.error || 'Failed to create user');
            }
        } catch (error) {
            toast.error('Failed to create user');
        } finally {
            setIsCreating(false);
        }
    };

    const getRoleBadge = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return <Badge variant="default" className="bg-red-500 hover:bg-red-600"><Shield className="w-3 h-3 mr-1" /> Admin</Badge>;
            case 'kitchen':
                return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600"><ChefHat className="w-3 h-3 mr-1" /> Kitchen</Badge>;
            case 'cashier':
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><Coffee className="w-3 h-3 mr-1" /> Cashier</Badge>;
            default:
                return <Badge variant="secondary"><UserIcon className="w-3 h-3 mr-1" /> Waiter</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Users</h1>
                    <p className="text-gray-500">Manage staff access and roles.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Create a new account for a staff member.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        placeholder="John Doe"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <RadioGroup
                                        value={formData.role}
                                        onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                                        className="grid grid-cols-2 gap-2"
                                    >
                                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="waiter" id="r-waiter" />
                                            <Label htmlFor="r-waiter" className="cursor-pointer flex-1">Waiter</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="kitchen" id="r-kitchen" />
                                            <Label htmlFor="r-kitchen" className="cursor-pointer flex-1">Kitchen</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="cashier" id="r-cashier" />
                                            <Label htmlFor="r-cashier" className="cursor-pointer flex-1">Cashier</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-slate-50">
                                            <RadioGroupItem value="admin" id="r-admin" />
                                            <Label htmlFor="r-admin" className="cursor-pointer flex-1">Admin</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create User'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Staff List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                                            Loading users...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.full_name}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
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
