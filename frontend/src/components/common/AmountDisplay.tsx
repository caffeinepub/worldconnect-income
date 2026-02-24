import React from 'react';

interface AmountDisplayProps {
  amount: number | bigint;
  size?: 'sm' | 'md' | 'lg';
  showSign?: boolean;
  className?: string;
}

export default function AmountDisplay({ amount, size = 'md', showSign = false, className = '' }: AmountDisplayProps) {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  const isPositive = numAmount >= 0;
  const sign = showSign ? (isPositive ? '+' : '') : '';

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
  };

  const colorClass = isPositive ? 'text-primary' : 'text-destructive';

  return (
    <span className={`font-semibold ${sizeClasses[size]} ${colorClass} ${className}`}>
      {sign}₹{numAmount.toLocaleString('en-IN')}
    </span>
  );
}
