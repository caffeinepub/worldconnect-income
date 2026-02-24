import React from 'react';
import { Link } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import AmountDisplay from '../components/common/AmountDisplay';
import LevelProgressCard from '../components/levels/LevelProgressCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpCircle, ArrowDownCircle, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No profile found. Please complete registration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Welcome back, {userProfile.name}!</h1>
        <p className="text-purple-100">Here's your account overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Balance Card */}
        <Card className="border-purple-200 shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <AmountDisplay amount={userProfile.balance} size="lg" />
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="border-purple-200 shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Level</CardTitle>
            <img src="/assets/generated/level-badge.dim_128x128.png" alt="Level" className="h-8 w-8" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Level {Number(userProfile.level)}</div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="border-purple-200 shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${userProfile.active ? 'text-green-600' : 'text-amber-600'}`}>
              {userProfile.active ? 'Active' : 'Inactive'}
            </div>
          </CardContent>
        </Card>

        {/* Phone Card */}
        <Card className="border-purple-200 shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Phone Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold text-foreground">{userProfile.phoneNumber}</div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <LevelProgressCard userProfile={userProfile} />

      {/* Quick Actions */}
      <Card className="border-purple-200 shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/deposit">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <ArrowUpCircle className="mr-2 h-4 w-4" />
                Deposit Funds
              </Button>
            </Link>
            <Link to="/withdrawal">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <ArrowDownCircle className="mr-2 h-4 w-4" />
                Withdraw Funds
              </Button>
            </Link>
            <Link to="/member-referrals">
              <Button variant="outline" className="w-full border-purple-300 text-primary hover:bg-purple-50">
                <Users className="mr-2 h-4 w-4" />
                View Referrals
              </Button>
            </Link>
            <Link to="/levels">
              <Button variant="outline" className="w-full border-purple-300 text-primary hover:bg-purple-50">
                <TrendingUp className="mr-2 h-4 w-4" />
                Level Structure
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
