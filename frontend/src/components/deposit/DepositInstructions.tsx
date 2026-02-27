import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

export default function DepositInstructions() {
  const steps = [
    'Open your UPI app (PhonePe, GPay, Paytm, etc.)',
    'Scan the QR code or use the UPI ID shown above',
    'Enter the amount you wish to deposit',
    'Complete the payment and note the Transaction ID',
    'Enter the amount and Transaction ID in the form below',
    'Click "Confirm Deposit" to update your balance',
  ];

  return (
    <Card className="border-red-100 shadow-red-sm">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <Info className="w-5 h-5 text-red-600" />
          How to Deposit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
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
