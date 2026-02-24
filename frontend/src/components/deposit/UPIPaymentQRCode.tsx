import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UPIPaymentQRCode() {
  return (
    <Card className="border-purple-200 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">Scan QR Code to Pay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-purple-200">
          <img
            src="/assets/generated/deposit-qr-code.dim_400x400.png"
            alt="UPI Payment QR Code"
            className="w-64 h-64"
          />
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200">
          <p className="text-sm font-semibold text-foreground mb-2">Payment Details:</p>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Name:</span> Santosh Ramabhau More
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">UPI ID:</span> 9422018674@kotak811
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
