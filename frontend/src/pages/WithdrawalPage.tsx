import React, { useState, useEffect } from 'react';
import { useCreateWithdrawalRequest, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AmountDisplay from '../components/common/AmountDisplay';
import { toast } from 'sonner';
import { AlertCircle, Info } from 'lucide-react';

export default function WithdrawalPage() {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [errors, setErrors] = useState<{ amount?: string; bankAccount?: string; ifscCode?: string }>({});

  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const createWithdrawalMutation = useCreateWithdrawalRequest();

  const availableBalance = userProfile ? Number(userProfile.balance) : 0;
  const maxWithdrawal = Math.floor(availableBalance * 0.01);

  // Real-time validation
  useEffect(() => {
    const newErrors: { amount?: string; bankAccount?: string; ifscCode?: string } = {};

    // Amount validation
    const amountNum = parseInt(amount);
    if (amount && (isNaN(amountNum) || amountNum <= 0)) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (amount && amountNum > maxWithdrawal) {
      newErrors.amount = `Maximum withdrawal allowed: ₹${maxWithdrawal.toLocaleString('en-IN')} (1% of balance)`;
    } else if (amount && amountNum > availableBalance) {
      newErrors.amount = `Insufficient balance. Available: ₹${availableBalance.toLocaleString('en-IN')}`;
    }

    // Bank account validation (9-18 digits)
    if (bankAccount && !/^\d{9,18}$/.test(bankAccount)) {
      newErrors.bankAccount = 'Bank account must be 9-18 digits';
    }

    // IFSC code validation (11 characters, alphanumeric)
    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'IFSC code must be 11 characters (e.g., SBIN0001234)';
    }

    setErrors(newErrors);
  }, [amount, bankAccount, ifscCode, availableBalance, maxWithdrawal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    const withdrawalAmount = parseInt(amount);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (withdrawalAmount > maxWithdrawal) {
      toast.error(`Maximum withdrawal allowed: ₹${maxWithdrawal.toLocaleString('en-IN')} (1% of balance)`);
      return;
    }

    if (withdrawalAmount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!bankAccount.trim() || !ifscCode.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const bankDetails = `Account: ${bankAccount}, IFSC: ${ifscCode.toUpperCase()}`;

    try {
      await createWithdrawalMutation.mutateAsync({
        amount: BigInt(withdrawalAmount),
        bankDetails,
      });
      toast.success('Withdrawal request submitted successfully!');
      setAmount('');
      setBankAccount('');
      setIfscCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal request');
    }
  };

  const isFormValid = !errors.amount && !errors.bankAccount && !errors.ifscCode && amount && bankAccount && ifscCode;

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
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Withdraw Funds</h1>
        <p className="text-purple-100">Request a withdrawal to your bank account</p>
      </div>

      {/* Available Balance */}
      {userProfile && (
        <Card className="border-purple-200 shadow-card">
          <CardHeader>
            <CardTitle className="font-display">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={userProfile.balance} size="lg" />
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Limit Info */}
      {userProfile && (
        <Card className="border-purple-200 bg-purple-50/50 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-purple-900">Withdrawal Limit</p>
                <p className="text-sm text-purple-700">
                  You can withdraw up to 1% of your total balance per request.
                </p>
                <p className="text-lg font-semibold text-purple-900 mt-2">
                  Maximum: ₹{maxWithdrawal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal Form */}
      <Card className="border-purple-200 shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Withdrawal Request</CardTitle>
          <CardDescription>Enter your bank details and withdrawal amount</CardDescription>
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
                max={maxWithdrawal}
                required
                className={`border-purple-200 focus:border-primary focus:ring-primary ${
                  errors.amount ? 'border-destructive' : ''
                }`}
              />
              {errors.amount && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.amount}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                type="text"
                placeholder="Enter bank account number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                required
                className={`border-purple-200 focus:border-primary focus:ring-primary ${
                  errors.bankAccount ? 'border-destructive' : ''
                }`}
              />
              {errors.bankAccount && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.bankAccount}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                type="text"
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                maxLength={11}
                required
                className={`border-purple-200 focus:border-primary focus:ring-primary ${
                  errors.ifscCode ? 'border-destructive' : ''
                }`}
              />
              {errors.ifscCode && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.ifscCode}</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={createWithdrawalMutation.isPending || !isFormValid}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {createWithdrawalMutation.isPending ? 'Submitting...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
