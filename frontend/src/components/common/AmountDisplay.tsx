import React from 'react';
import { cn } from '@/lib/utils';

interface AmountDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;
  className?: string;
}

export default function AmountDisplay({
  amount,
  size = 'md',
  showSign = false,
  className,
}: AmountDisplayProps) {
  const isPositive = amount >= 0;
  const isNegative = amount < 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const colorClass = isNegative
    ? 'text-destructive'
    : 'text-red-600';

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  const sign = showSign ? (isNegative ? '-' : '+') : isNegative ? '-' : '';

  return (
    <span className={cn(sizeClasses[size], colorClass, 'font-semibold', className)}>
      {sign}{formatted}
    </span>
  );
}
