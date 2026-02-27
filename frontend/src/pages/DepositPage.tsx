import React, { useState } from 'react';
import { useDeposit } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownLeft, CheckCircle, AlertCircle } from 'lucide-react';
import UPIPaymentQRCode from '../components/deposit/UPIPaymentQRCode';
import DepositInstructions from '../components/deposit/DepositInstructions';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const depositMutation = useDeposit();

  const handleDeposit = async () => {
    const amountNum = parseInt(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!transactionId.trim()) {
      setError('Please enter the transaction ID');
      return;
    }

    setError('');
    try {
      await depositMutation.mutateAsync(BigInt(amountNum));
      setSuccess(true);
      setAmount('');
      setTransactionId('');
    } catch (err: any) {
      setError(err.message || 'Deposit failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Deposit Funds</h1>
            <p className="text-red-200 text-sm">Add money to your account via UPI</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Deposit Successful!</p>
            <p className="text-sm text-green-600">Your balance has been updated.</p>
          </div>
        </div>
      )}

      {/* QR Code */}
      <UPIPaymentQRCode />

      {/* Instructions */}
      <DepositInstructions />

      {/* Deposit Form */}
      <Card className="border-red-100 shadow-red-sm">
        <CardHeader>
          <CardTitle className="font-heading">Confirm Your Deposit</CardTitle>
          <CardDescription>Enter the amount and transaction ID after payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter deposit amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="focus:ring-red-500 focus:border-red-500"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="txnId">Transaction ID / UTR Number</Label>
            <Input
              id="txnId"
              placeholder="Enter UPI transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleDeposit}
            disabled={depositMutation.isPending || !amount || !transactionId}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
            size="lg"
          >
            {depositMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5" />
                Confirm Deposit
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
