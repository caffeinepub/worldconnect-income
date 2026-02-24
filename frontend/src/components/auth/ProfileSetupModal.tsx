import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { UserProfile } from '../../backend';

interface ProfileSetupModalProps {
  open: boolean;
  onComplete: () => void;
}

export default function ProfileSetupModal({ open, onComplete }: ProfileSetupModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const saveProfileMutation = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const profile: UserProfile = {
      name: 'User',
      phoneNumber,
      balance: BigInt(0),
      referrer: undefined,
      level: BigInt(1),
      active: false,
    };

    try {
      await saveProfileMutation.mutateAsync(profile);
      toast.success('Profile setup complete!');
      onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display">Complete Your Profile</DialogTitle>
          <DialogDescription>Please provide your phone number to continue</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button
            type="submit"
            disabled={saveProfileMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            {saveProfileMutation.isPending ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
