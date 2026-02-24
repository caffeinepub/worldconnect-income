import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate({ to: '/dashboard' });
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const stats = [
    { title: 'Total Users', value: '0', icon: Users, color: 'text-primary' },
    { title: 'Total Deposits', value: '₹0', icon: DollarSign, color: 'text-green-600' },
    { title: 'Total Withdrawals', value: '₹0', icon: TrendingUp, color: 'text-purple-600' },
    { title: 'Pending Requests', value: '0', icon: FileText, color: 'text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Admin Dashboard</h1>
        <p className="text-purple-100">System overview and statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-purple-200 shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for future features */}
      <Card className="border-purple-200 shadow-card">
        <CardHeader>
          <CardTitle className="font-display">System Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed statistics and charts will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
