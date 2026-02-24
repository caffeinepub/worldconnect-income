import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useRegisterUser } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Principal } from '@icp-sdk/core/principal';
import { getUrlParameter } from '../utils/urlParams';

export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referrerCode, setReferrerCode] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();
  const { login, identity } = useInternetIdentity();
  const registerMutation = useRegisterUser();

  const REGISTRATION_FEE = 100;

  useEffect(() => {
    const urlReferrer = getUrlParameter('referrer');
    if (urlReferrer) {
      setReferrerCode(urlReferrer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
      toast.error('Please enter a valid name (2-50 characters, letters only)');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      if (!identity) {
        await login();
      }

      setPaymentProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let referrerPrincipal: Principal | null = null;
      if (referrerCode.trim()) {
        try {
          referrerPrincipal = Principal.fromText(referrerCode);
        } catch (error) {
          toast.error('Invalid referrer code');
          setPaymentProcessing(false);
          return;
        }
      }

      await registerMutation.mutateAsync({
        name,
        phoneNumber,
        referrer: referrerPrincipal,
        paymentAmount: BigInt(REGISTRATION_FEE),
      });

      toast.success('Registration successful! Welcome to the platform.');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <Card className="w-full max-w-md border-purple-200 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl text-center font-display">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join our MLM platform with a one-time registration fee of ₹{REGISTRATION_FEE}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-purple-200 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                maxLength={10}
                required
                className="border-purple-200 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referrer">Referrer Code (Optional)</Label>
              <Input
                id="referrer"
                type="text"
                placeholder="Enter referrer code if you have one"
                value={referrerCode}
                onChange={(e) => setReferrerCode(e.target.value)}
                className="border-purple-200 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-semibold text-foreground mb-1">Registration Fee</p>
              <p className="text-2xl font-bold text-primary">₹{REGISTRATION_FEE}</p>
            </div>

            <Button
              type="submit"
              disabled={paymentProcessing || registerMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {paymentProcessing || registerMutation.isPending ? 'Processing...' : 'Pay & Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button onClick={() => navigate({ to: '/login' })} className="text-primary hover:underline font-medium">
                Login here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
