'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCategories, useCreateMenu, useUpdateMenu } from '@/hooks/use-menus';
import { Menu, MenuFormData } from '@/types';
import { Loader2 } from 'lucide-react';

const menuSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    price: z.number().min(0, 'Price must be positive'),
    category_id: z.number().min(1, 'Category is required'),
    image_url: z.string().optional(),
    is_active: z.boolean(),
    daily_stock: z.number().min(0, 'Stock must be non-negative'),
});

type MenuFormValues = z.infer<typeof menuSchema>;

interface MenuFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    menuToEdit?: Menu | null;
}

export function MenuFormDialog({ open, onOpenChange, menuToEdit }: MenuFormDialogProps) {
    const { data: categories = [] } = useCategories();
    const createMenu = useCreateMenu();
    const updateMenu = useUpdateMenu();

    const form = useForm<MenuFormValues>({
        resolver: zodResolver(menuSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category_id: 0,
            image_url: '',
            is_active: true,
            daily_stock: 0,
        },
    });

    useEffect(() => {
        if (menuToEdit) {
            form.reset({
                name: menuToEdit.name,
                description: menuToEdit.description || '',
                price: Number(menuToEdit.price),
                category_id: Number(menuToEdit.category_id),
                image_url: menuToEdit.image_url || '',
                is_active: Boolean(menuToEdit.is_active),
                daily_stock: menuToEdit.inventory?.daily_stock || 0,
            });
        } else {
            form.reset({
                name: '',
                description: '',
                price: 0,
                category_id: 0,
                image_url: '',
                is_active: true,
                daily_stock: 0,
            });
        }
    }, [menuToEdit, form, open]);

    const onSubmit = async (data: MenuFormValues) => {
        try {
            // Explicitly cast to match exact expected type if needed, or rely on compatibility
            const payload: MenuFormData = {
                ...data,
                description: data.description || undefined,
                image_url: data.image_url || undefined,
            };

            if (menuToEdit) {
                await updateMenu.mutateAsync({
                    id: menuToEdit.id,
                    data: payload
                });
            } else {
                await createMenu.mutateAsync(payload);
            }
            onOpenChange(false);
            if (!menuToEdit) form.reset();
        } catch (error) {
            console.error('Failed to submit menu form:', error);
        }
    };

    const isSubmitting = createMenu.isPending || updateMenu.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{menuToEdit ? 'Edit Menu' : 'Add New Menu'}</DialogTitle>
                    <DialogDescription>
                        {menuToEdit ? 'Update existing menu details.' : 'Add a new item to your menu.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Nasi Goreng" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="100"
                                                placeholder="0"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="daily_stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Daily Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>Reset daily availability.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the dish..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Active Status</FormLabel>
                                        <FormDescription>
                                            Available for ordering
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {menuToEdit ? 'Update Menu' : 'Create Menu'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
