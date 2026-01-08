// ============================================
// RESTAUS - Admin Settings Page
// ============================================

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

export default function AdminSettingsPage() {
    const [restaurantName, setRestaurantName] = useState('RESTAUS Restaurant');
    const [address, setAddress] = useState('Jl. Contoh No. 123, Jakarta');
    const [phone, setPhone] = useState('+62 812-3456-7890');
    const [tax, setTax] = useState('10');
    const [serviceCharge, setServiceCharge] = useState('5');
    const [printReceipt, setPrintReceipt] = useState(true);

    const handleSave = () => {
        // Simulate save
        toast.success('Settings saved successfully');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500">Manage your restaurant configuration.</p>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="printing">Printing</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurant Information</CardTitle>
                            <CardDescription>
                                Used on receipts and dashboard headers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Restaurant Name</Label>
                                <Input
                                    id="name"
                                    value={restaurantName}
                                    onChange={(e) => setRestaurantName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tax & Service Charge</CardTitle>
                            <CardDescription>
                                Configure percentage for tax and service charges.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tax">Tax (%)</Label>
                                    <Input
                                        id="tax"
                                        type="number"
                                        value={tax}
                                        onChange={(e) => setTax(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="service">Service Charge (%)</Label>
                                    <Input
                                        id="service"
                                        type="number"
                                        value={serviceCharge}
                                        onChange={(e) => setServiceCharge(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="printing" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Receipt Printing</CardTitle>
                            <CardDescription>
                                Configure printer behavior.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Auto Print Receipt</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically print receipt after payment completion.
                                    </p>
                                </div>
                                <Switch
                                    checked={printReceipt}
                                    onCheckedChange={setPrintReceipt}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end">
                <Button onClick={handleSave} size="lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
