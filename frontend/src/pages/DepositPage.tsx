import React, { useState } from 'react';
import { useDeposit, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AmountDisplay from '../components/common/AmountDisplay';
import UPIPaymentQRCode from '../components/deposit/UPIPaymentQRCode';
import DepositInstructions from '../components/deposit/DepositInstructions';
import { toast } from 'sonner';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const depositMutation = useDeposit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const depositAmount = parseInt(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    try {
      await depositMutation.mutateAsync(BigInt(depositAmount));
      toast.success('Deposit request submitted successfully!');
      setAmount('');
      setTransactionId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit deposit');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Deposit Funds</h1>
        <p className="text-purple-100">Add funds to your account via UPI payment</p>
      </div>

      {/* Current Balance */}
      {userProfile && (
        <Card className="border-purple-200 shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={userProfile.balance} size="lg" />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: QR Code and Instructions */}
        <div className="space-y-6">
          <UPIPaymentQRCode />
          <DepositInstructions />
        </div>

        {/* Right Column: Deposit Form */}
        <Card className="border-purple-200 shadow-card h-fit">
          <CardHeader>
            <CardTitle className="font-display">Submit Deposit</CardTitle>
            <CardDescription>Enter the amount and transaction details after payment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  required
                  className="border-purple-200 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  type="text"
                  placeholder="Enter UPI transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                  className="border-purple-200 focus:border-primary focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  You can find this in your payment app after completing the transaction
                </p>
              </div>

              <Button
                type="submit"
                disabled={depositMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {depositMutation.isPending ? 'Submitting...' : 'Submit Deposit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
