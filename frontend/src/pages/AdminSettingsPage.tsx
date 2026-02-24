import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsCallerAdmin } from '../hooks/useQueries';
import AdminLayout from '../components/layout/AdminLayout';

export default function AdminSettingsPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You do not have permission to access this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-700">System Settings</h1>
          <p className="text-muted-foreground mt-2">Configure system parameters</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>System configuration features will be available soon</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You'll be able to configure commission rates, fees, and other system parameters here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
