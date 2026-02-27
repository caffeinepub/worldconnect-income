import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, CheckCircle, Link } from 'lucide-react';

interface ReferralLinkGeneratorProps {
  principalId: string;
}

export default function ReferralLinkGenerator({ principalId }: ReferralLinkGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const referralUrl = `${window.location.origin}/register?ref=${principalId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = referralUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-red-200 shadow-red-sm">
      <CardHeader>
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <Link className="w-5 h-5 text-red-600" />
          Your Referral Link
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-600 font-medium mb-1">Share this link to invite members</p>
          <p className="text-xs text-muted-foreground break-all font-mono">{referralUrl}</p>
        </div>

        <div className="flex gap-2">
          <Input
            value={referralUrl}
            readOnly
            className="text-xs focus:ring-red-500 focus:border-red-500"
          />
          <Button
            onClick={handleCopy}
            className={`flex-shrink-0 ${
              copied
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {copied ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>

        {copied && (
          <p className="text-xs text-green-600 font-medium text-center">
            ✓ Link copied to clipboard!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
