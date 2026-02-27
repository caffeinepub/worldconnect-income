import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: (name: string, phoneNumber: string) => Promise<void>;
}

export default function ProfileSetupModal({ open, onComplete }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Name is required'); return; }
    if (!phoneNumber.trim()) { setError('Phone number is required'); return; }

    setIsLoading(true);
    setError('');
    try {
      await onComplete(name.trim(), phoneNumber.trim());
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your details to complete account setup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="profileName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="profileName"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePhone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="profilePhone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !name || !phoneNumber}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Saving...
              </span>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
