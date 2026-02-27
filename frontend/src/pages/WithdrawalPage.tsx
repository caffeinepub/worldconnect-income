import React, { useState } from 'react';
import { useGetCallerUserProfile, useCreateWithdrawalRequest } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpRight, CheckCircle, AlertCircle, Info } from 'lucide-react';
import AmountDisplay from '../components/common/AmountDisplay';

export default function WithdrawalPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const withdrawalMutation = useCreateWithdrawalRequest();

  const balance = profile ? Number(profile.balance) : 0;
  const maxWithdrawal = Math.floor(balance / 100);
  const amountNum = parseInt(amount) || 0;
  const isOverLimit = amountNum > maxWithdrawal;

  const handleWithdraw = async () => {
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (isOverLimit) {
      setError(`Amount cannot exceed 1% of your balance (max: ₹${maxWithdrawal})`);
      return;
    }
    if (!bankDetails.trim()) {
      setError('Please enter your bank details');
      return;
    }

    setError('');
    try {
      await withdrawalMutation.mutateAsync({ amount: BigInt(amountNum), bankDetails: bankDetails.trim() });
      setSuccess(true);
      setAmount('');
      setBankDetails('');
    } catch (err: any) {
      setError(err.message || 'Withdrawal request failed. Please try again.');
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Withdraw Funds</h1>
            <p className="text-red-200 text-sm">Request a withdrawal to your bank account</p>
          </div>
        </div>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Withdrawal Request Submitted!</p>
            <p className="text-sm text-green-600">Your request is pending admin approval.</p>
          </div>
        </div>
      )}

      {/* Balance & Limit Info */}
      <Card className="border-red-100 shadow-red-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Withdrawal Limit</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Current Balance</p>
              <AmountDisplay amount={balance} size="lg" className="text-foreground font-bold" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Max Withdrawal (1%)</p>
              <AmountDisplay amount={maxWithdrawal} size="lg" className="text-red-600 font-bold" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <Card className="border-red-100 shadow-red-sm">
        <CardHeader>
          <CardTitle className="font-heading">Withdrawal Request</CardTitle>
          <CardDescription>You can withdraw up to 1% of your total balance per request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Max: ₹${maxWithdrawal}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`focus:ring-red-500 focus:border-red-500 ${isOverLimit ? 'border-red-500' : ''}`}
              min="1"
              max={maxWithdrawal}
            />
            {isOverLimit && (
              <p className="text-xs text-red-600">
                Amount exceeds 1% limit. Maximum allowed: ₹{maxWithdrawal}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankDetails">Bank Details / UPI ID</Label>
            <Input
              id="bankDetails"
              placeholder="Enter bank account number or UPI ID"
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
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
            onClick={handleWithdraw}
            disabled={withdrawalMutation.isPending || !amount || !bankDetails || isOverLimit}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
            size="lg"
          >
            {withdrawalMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5" />
                Submit Withdrawal Request
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
