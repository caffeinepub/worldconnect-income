import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { WithdrawalStatus } from '../../backend';

interface StatusBadgeProps {
  status: WithdrawalStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusDisplay = () => {
    if ('pending' in status) {
      return { label: 'Pending', variant: 'default' as const, color: 'bg-purple-100 text-purple-700 border-purple-300' };
    }
    if ('approved' in status) {
      return { label: 'Approved', variant: 'default' as const, color: 'bg-green-100 text-green-700 border-green-300' };
    }
    if ('rejected' in status) {
      return { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-700 border-red-300' };
    }
    return { label: 'Unknown', variant: 'default' as const, color: 'bg-gray-100 text-gray-700 border-gray-300' };
  };

  const { label, variant, color } = getStatusDisplay();
  const rejectionReason = 'rejected' in status ? status.rejected : null;

  const badge = (
    <Badge variant={variant} className={color}>
      {label}
    </Badge>
  );

  if (rejectionReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Reason: {rejectionReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
