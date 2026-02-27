import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WithdrawalStatus } from '../../backend';

interface StatusBadgeProps {
  status: WithdrawalStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status.__kind__ === 'pending') {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-100">
        Pending
      </Badge>
    );
  }

  if (status.__kind__ === 'approved') {
    return (
      <Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-100">
        Approved
      </Badge>
    );
  }

  if (status.__kind__ === 'rejected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="bg-red-100 text-red-800 border border-red-300 hover:bg-red-100 cursor-help">
              Rejected
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-48">{status.rejected}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}
