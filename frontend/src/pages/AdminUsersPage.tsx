import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">User Management</h1>
            <p className="text-red-200 text-sm">View and manage registered users</p>
          </div>
        </div>
      </div>

      <Card className="border-red-100 shadow-red-sm">
        <CardHeader>
          <CardTitle className="font-heading">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>User management features coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
