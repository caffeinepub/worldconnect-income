import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, Phone, Shield, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRequestMemberOTP, useVerifyMemberOTP } from '../hooks/useQueries';

type LoginTab = 'member' | 'admin';
type MemberStep = 'phone' | 'otp';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  // Admin login state
  const [adminPhone, setAdminPhone] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  // Member OTP login state
  const [memberPhone, setMemberPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [memberStep, setMemberStep] = useState<MemberStep>('phone');
  const [otpSentMessage, setOtpSentMessage] = useState('');

  const requestOTPMutation = useRequestMemberOTP();
  const verifyOTPMutation = useVerifyMemberOTP();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleAdminLogin = async () => {
    if (!actor) return;
    setIsAdminLoading(true);
    setAdminError('');
    try {
      const success = await actor.adminLogin(adminPhone);
      if (success) {
        queryClient.invalidateQueries();
        navigate({ to: '/admin' });
      } else {
        setAdminError('Invalid admin phone number');
      }
    } catch (error: any) {
      setAdminError(error.message || 'Admin login failed');
    } finally {
      setIsAdminLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    if (!memberPhone.trim()) return;
    setOtpSentMessage('');
    try {
      const message = await requestOTPMutation.mutateAsync(memberPhone.trim());
      setOtpSentMessage(message);
      setMemberStep('otp');
    } catch (error: any) {
      // error is shown via mutation state
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim() || !memberPhone.trim()) return;
    try {
      const principal = await verifyOTPMutation.mutateAsync({
        phoneNumber: memberPhone.trim(),
        otp: otp.trim(),
      });
      if (principal !== null) {
        queryClient.invalidateQueries();
        navigate({ to: '/dashboard' });
      }
    } catch (error: any) {
      // error is shown via mutation state
    }
  };

  const handleBackToPhone = () => {
    setMemberStep('phone');
    setOtp('');
    setOtpSentMessage('');
    verifyOTPMutation.reset();
    requestOTPMutation.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-red-xl mb-4">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white">FinanceMLM</h1>
          <p className="text-red-200 mt-1">Your financial growth partner</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-red-xl border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-heading text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Tabs defaultValue="member" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="member" className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Member Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Admin Login
                </TabsTrigger>
              </TabsList>

              {/* Member Login Tab */}
              <TabsContent value="member" className="space-y-4 mt-0">
                {memberStep === 'phone' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="memberPhone">Mobile Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="memberPhone"
                          type="tel"
                          placeholder="Enter your registered mobile number"
                          value={memberPhone}
                          onChange={(e) => setMemberPhone(e.target.value)}
                          className="pl-10 focus:ring-red-500 focus:border-red-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleRequestOTP()}
                        />
                      </div>
                    </div>

                    {requestOTPMutation.isError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-red-600 text-sm">
                          {(requestOTPMutation.error as any)?.message?.includes('No user registered')
                            ? 'This mobile number is not registered. Please register first.'
                            : (requestOTPMutation.error as any)?.message || 'Failed to send OTP. Please try again.'}
                        </span>
                      </div>
                    )}

                    <Button
                      onClick={handleRequestOTP}
                      disabled={requestOTPMutation.isPending || !memberPhone.trim()}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                      size="lg"
                    >
                      {requestOTPMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Sending OTP...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Send OTP
                        </span>
                      )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <button
                        onClick={() => navigate({ to: '/register' })}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Register here
                      </button>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">or</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={loginStatus === 'logging-in'}
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                      size="lg"
                    >
                      {loginStatus === 'logging-in' ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></span>
                          Connecting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <LogIn className="w-4 h-4" />
                          Login with Identity
                        </span>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* OTP Step */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={handleBackToPhone}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-muted-foreground">Back to phone number</span>
                    </div>

                    {otpSentMessage && (
                      <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-green-700 text-sm">{otpSentMessage}</span>
                      </div>
                    )}

                    <div className="text-center py-1">
                      <p className="text-sm text-muted-foreground">
                        OTP sent to{' '}
                        <span className="font-semibold text-foreground">{memberPhone}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Demo OTP: <span className="font-mono font-bold text-red-600">1234</span>)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 4-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="text-center text-xl tracking-widest font-mono focus:ring-red-500 focus:border-red-500"
                        maxLength={4}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
                      />
                    </div>

                    {verifyOTPMutation.isError && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-red-600 text-sm">
                          {(verifyOTPMutation.error as any)?.message?.includes('Invalid OTP')
                            ? 'Invalid OTP. Please check and try again.'
                            : (verifyOTPMutation.error as any)?.message || 'Verification failed. Please try again.'}
                        </span>
                      </div>
                    )}

                    <Button
                      onClick={handleVerifyOTP}
                      disabled={verifyOTPMutation.isPending || otp.length < 4}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                      size="lg"
                    >
                      {verifyOTPMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Verify & Login
                        </span>
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        onClick={handleRequestOTP}
                        disabled={requestOTPMutation.isPending}
                        className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                      >
                        {requestOTPMutation.isPending ? 'Resending...' : 'Resend OTP'}
                      </button>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Admin Login Tab */}
              <TabsContent value="admin" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Admin Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="adminPhone"
                      type="tel"
                      placeholder="Enter admin phone number"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="pl-10 focus:ring-red-500 focus:border-red-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    />
                  </div>
                </div>

                {adminError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-600 text-sm">{adminError}</span>
                  </div>
                )}

                <Button
                  onClick={handleAdminLogin}
                  disabled={isAdminLoading || !adminPhone}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  {isAdminLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Admin Login
                    </span>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
