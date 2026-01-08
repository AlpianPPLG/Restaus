// ============================================
// RESTAUS - Payment Form Organism
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { Order, PaymentMethod } from '@/types';
import { useProcessPayment, useCalculateChange, useCalculateTotal } from '@/hooks/use-payments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PAYMENT_METHODS } from '@/constants';
import { Receipt, CreditCard, Banknote, Printer, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';


interface PaymentFormProps {
    order: Order | null;
    onSuccess?: (orderId: number) => void;
}

export function PaymentForm({ order, onSuccess }: PaymentFormProps) {
    const [amountPaid, setAmountPaid] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

    const processPayment = useProcessPayment();
    const { calculateChange } = useCalculateChange();

    // Reset form when order changes
    useEffect(() => {
        setAmountPaid('');
        setPaymentMethod('cash');
    }, [order?.id]);

    if (!order) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                <Receipt className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Order Selected</h3>
                <p className="text-center">Select an order from the list to process payment.</p>
            </div>
        );
    }

    const { total_amount } = order;
    const numPaid = parseFloat(amountPaid) || 0;
    const { change, isValid, shortage } = calculateChange(total_amount, numPaid);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid && paymentMethod === 'cash') {
            toast.error('Insufficient payment amount');
            return;
        }

        try {
            await processPayment.mutateAsync({
                order_id: order.id,
                payment_method: paymentMethod,
                amount_paid: numPaid,
            });
            onSuccess?.(order.id);
        } catch (error) {
            // Handled by hook
        }
    };

    const handleQuickAmount = (amount: number) => {
        setAmountPaid(amount.toString());
    };

    return (
        <Card className="h-full flex flex-col border-0 shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Receipt className="w-6 h-6 text-orange-600" />
                    Payment Details
                </CardTitle>
                <p className="text-gray-500">
                    Order #{order.id} • {order.table?.table_number ? `Table ${order.table.table_number}` : 'Take Away'}
                </p>
            </CardHeader>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <CardContent className="flex-1 px-0 space-y-6">

                    {/* Order Summary List */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">Order Items</h4>
                        <ScrollArea className="h-[150px] pr-4">
                            <div className="space-y-2">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {item.quantity}x {item.menu?.name}
                                        </span>
                                        <span className="font-medium">
                                            Rp {item.subtotal.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <Separator className="bg-gray-200 dark:bg-gray-700" />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-lg font-bold">Total Amount</span>
                            <span className="text-2xl font-bold text-orange-600">
                                Rp {total_amount.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Payment Method</Label>
                        <RadioGroup
                            value={paymentMethod}
                            onValueChange={(val: string) => setPaymentMethod(val as PaymentMethod)}
                            className="grid grid-cols-3 gap-4"
                        >
                            <div className="relative">
                                <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
                                <Label
                                    htmlFor="cash"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 dark:peer-data-[state=checked]:bg-orange-950/20 cursor-pointer transition-all hover:bg-gray-50"
                                >
                                    <Banknote className="w-6 h-6 mb-2" />
                                    Cash
                                </Label>
                            </div>
                            <div className="relative">
                                <RadioGroupItem value="qris" id="qris" className="peer sr-only" />
                                <Label
                                    htmlFor="qris"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 dark:peer-data-[state=checked]:bg-orange-950/20 cursor-pointer transition-all hover:bg-gray-50"
                                >
                                    <CheckCircle2 className="w-6 h-6 mb-2" />
                                    QRIS
                                </Label>
                            </div>
                            <div className="relative">
                                <RadioGroupItem value="debit" id="debit" className="peer sr-only" />
                                <Label
                                    htmlFor="debit"
                                    className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 dark:peer-data-[state=checked]:bg-orange-950/20 cursor-pointer transition-all hover:bg-gray-50"
                                >
                                    <CreditCard className="w-6 h-6 mb-2" />
                                    Debit
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Cash Input */}
                    {paymentMethod === 'cash' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-base font-semibold">Cash Received</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rp</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="0"
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(e.target.value)}
                                        className="pl-10 text-lg h-12 font-bold"
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Quick Amounts */}
                            <div className="flex gap-2 flex-wrap">
                                {[total_amount, 50000, 100000, 200000].map((amt) => {
                                    if (amt < total_amount && amt !== total_amount) return null;
                                    return (
                                        <Button
                                            key={amt}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleQuickAmount(amt)}
                                            className={numPaid === amt ? 'bg-orange-100 border-orange-200 text-orange-700' : ''}
                                        >
                                            {amt === total_amount ? 'Exact' : (amt / 1000) + 'k'}
                                        </Button>
                                    )
                                })}
                            </div>

                            {/* Change/Shortage Display */}
                            <div className={cn(
                                "p-4 rounded-lg flex justify-between items-center transition-colors",
                                isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            )}>
                                <span className="font-semibold">
                                    {isValid ? 'Change Due' : 'Shortage'}
                                </span>
                                <span className="text-xl font-bold">
                                    Rp {(isValid ? change : shortage).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="px-0 pt-4 gap-3">
                    <Button
                        type="submit"
                        className="flex-1 h-12 text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-900/20"
                        disabled={paymentMethod === 'cash' && !isValid || processPayment.isPending}
                    >
                        {processPayment.isPending ? 'Processing...' : 'Complete Payment'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
