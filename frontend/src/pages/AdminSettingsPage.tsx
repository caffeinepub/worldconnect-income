import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">System Settings</h1>
            <p className="text-red-200 text-sm">Configure system parameters</p>
          </div>
        </div>
      </div>

      <Card className="border-red-100 shadow-red-sm">
        <CardHeader>
          <CardTitle className="font-heading">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>System settings configuration coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
