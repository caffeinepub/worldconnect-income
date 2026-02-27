import React, { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useActor } from '../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Phone, User, IndianRupee, AlertCircle } from 'lucide-react';
import { Principal } from '@dfinity/principal';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referrerInput, setReferrerInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async () => {
    if (!actor || !identity) return;
    if (!name.trim()) { setError('Name is required'); return; }
    if (!phoneNumber.trim()) { setError('Phone number is required'); return; }

    setIsLoading(true);
    setError('');

    try {
      let referrerPrincipal: Principal | null = null;
      if (referrerInput.trim()) {
        try {
          referrerPrincipal = Principal.fromText(referrerInput.trim());
        } catch {
          setError('Invalid referrer ID format');
          setIsLoading(false);
          return;
        }
      }

      await actor.registerUser(name.trim(), phoneNumber.trim(), referrerPrincipal, BigInt(100));
      queryClient.invalidateQueries();
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Brand */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-red-xl mb-4">
            <img src="/assets/generated/logo.dim_256x256.png" alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white">Join FinanceMLM</h1>
          <p className="text-red-200 mt-1">Start your financial journey today</p>
        </div>

        <Card className="shadow-red-xl border-red-200">
          <CardHeader>
            <CardTitle className="text-xl font-heading text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Register to join our network and start earning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Registration Fee Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <IndianRupee className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Registration Fee: ₹100</p>
                <p className="text-xs text-red-600">One-time fee to activate your account</p>
              </div>
            </div>

            {!identity ? (
              <>
                <p className="text-sm text-muted-foreground text-center">
                  First, connect your identity to proceed with registration
                </p>
                <Button
                  onClick={handleLogin}
                  disabled={loginStatus === 'logging-in'}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  size="lg"
                >
                  {loginStatus === 'logging-in' ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Connecting...
                    </span>
                  ) : (
                    'Connect Identity'
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referrer">Referrer ID (Optional)</Label>
                  <Input
                    id="referrer"
                    placeholder="Enter referrer's principal ID"
                    value={referrerInput}
                    onChange={(e) => setReferrerInput(e.target.value)}
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
                  onClick={handleRegister}
                  disabled={isLoading || !name || !phoneNumber}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                  size="lg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Registering...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Register (Pay ₹100)
                    </span>
                  )}
                </Button>
              </>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate({ to: '/login' })}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Login here
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
