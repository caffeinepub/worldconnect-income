import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DepositInstructions() {
  const steps = [
    'Enter the amount you want to deposit in the form',
    'Scan the QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.)',
    'Complete the payment in your UPI app',
    'Note down the transaction ID from your payment app',
    'Enter the transaction ID in the form and submit',
  ];

  return (
    <Card className="border-purple-200 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">How to Deposit</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
