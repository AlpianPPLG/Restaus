// ============================================
// RESTAUS - Register Page
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, RegisterCredentials } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterCredentials>({
        username: '',
        password: '',
        full_name: '',
        role: 'waiter' // default role
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setFormData({ ...formData, role: value as UserRole });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData);
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Brand */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg mb-4">
                        <UtensilsCrossed className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        Create Account
                    </h1>
                </div>

                {/* Register Card */}
                <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl font-bold text-center">
                            Join RESTAUS
                        </CardTitle>
                        <CardDescription className="text-center">
                            Create a new staff account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="johndoe"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Role</Label>
                                <RadioGroup
                                    value={formData.role}
                                    onValueChange={handleRoleChange}
                                    className="grid grid-cols-2 gap-2"
                                >
                                    <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                        <RadioGroupItem value="waiter" id="r-waiter" />
                                        <Label htmlFor="r-waiter" className="cursor-pointer flex-1">Waiter</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                        <RadioGroupItem value="kitchen" id="r-kitchen" />
                                        <Label htmlFor="r-kitchen" className="cursor-pointer flex-1">Kitchen</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                        <RadioGroupItem value="cashier" id="r-cashier" />
                                        <Label htmlFor="r-cashier" className="cursor-pointer flex-1">Cashier</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                                        <RadioGroupItem value="admin" id="r-admin" />
                                        <Label htmlFor="r-admin" className="cursor-pointer flex-1">Admin</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </Button>
                        </form>

                        <div className="mt-4 text-center text-sm">
                            <span className="text-gray-500">Already have an account? </span>
                            <Link href="/login" className="text-orange-600 hover:underline font-semibold">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
