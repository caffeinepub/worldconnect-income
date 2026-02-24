import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useAdminLogin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const adminLoginMutation = useAdminLogin();

  const DEMO_OTP = '123456';
  const ADMIN_PHONE = '9422018674';

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setOtpSent(true);
    toast.success(`OTP sent to ${phoneNumber}. Demo OTP: ${DEMO_OTP}`);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp !== DEMO_OTP) {
      toast.error('Invalid OTP. Please try again.');
      return;
    }

    try {
      await login();

      if (phoneNumber === ADMIN_PHONE) {
        const isAdmin = await adminLoginMutation.mutateAsync(phoneNumber);
        if (isAdmin) {
          toast.success('Admin login successful!');
          navigate({ to: '/admin/dashboard' });
        } else {
          toast.error('Admin authentication failed');
        }
      } else {
        toast.success('Login successful!');
        navigate({ to: '/dashboard' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4">
      <Card className="w-full max-w-md border-purple-200 shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl text-center font-display">Welcome Back</CardTitle>
          <CardDescription className="text-center">Login to your MLM account</CardDescription>
        </CardHeader>
        <CardContent>
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="border-purple-200 focus:border-primary focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">Demo OTP: {DEMO_OTP}</p>
              </div>
              <Button
                type="submit"
                disabled={loginStatus === 'logging-in'}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {loginStatus === 'logging-in' ? 'Verifying...' : 'Verify & Login'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOtpSent(false)} className="w-full">
                Change Phone Number
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate({ to: '/register' })}
                className="text-primary hover:underline font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
