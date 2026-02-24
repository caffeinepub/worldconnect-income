import React, { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralLinkGenerator() {
  const { identity } = useInternetIdentity();
  const [copied, setCopied] = useState(false);

  const referralLink = identity
    ? `${window.location.origin}/register?referrer=${identity.getPrincipal().toString()}`
    : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card className="border-purple-200 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">Your Referral Link</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={referralLink}
            readOnly
            className="font-mono text-sm border-purple-200 bg-purple-50 dark:bg-purple-900/20"
          />
          <Button onClick={handleCopy} className="bg-primary hover:bg-primary/90 text-white shrink-0">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Share this link with others to earn referral rewards when they join and become active members.
        </p>
      </CardContent>
    </Card>
  );
}
