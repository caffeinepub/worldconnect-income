import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetCallerUserProfile,
  useGetTotalTeamSize,
  useGetTotalEarnings,
  useGetTotalLevelIncome,
} from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Star,
  Phone,
  Users,
  TrendingUp,
  History,
} from 'lucide-react';
import AmountDisplay from '../components/common/AmountDisplay';
import LevelProgressCard from '../components/levels/LevelProgressCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: totalTeamSize } = useGetTotalTeamSize();
  const { data: totalEarnings } = useGetTotalEarnings();
  const { data: totalLevelIncome } = useGetTotalLevelIncome();

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found. Please register first.</p>
        <Button onClick={() => navigate({ to: '/register' })} className="mt-4 bg-red-600 hover:bg-red-700">
          Register Now
        </Button>
      </div>
    );
  }

  const balance = Number(profile.balance);
  const level = Number(profile.level);
  const teamSize = totalTeamSize ? Number(totalTeamSize) : 0;
  const earnings = totalEarnings ? Number(totalEarnings) : 0;
  const levelIncome = totalLevelIncome ? Number(totalLevelIncome) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-red-200 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-heading font-bold mt-1">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-red-300" />
              <span className="text-red-200 text-sm">{profile.phoneNumber}</span>
            </div>
          </div>
          <div className="text-right">
            <Badge
              className={`${
                profile.active
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-400 hover:bg-red-500'
              } text-white border-0`}
            >
              {profile.active ? 'Active' : 'Inactive'}
            </Badge>
            <div className="mt-2 flex items-center gap-1 text-red-200">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">Level {level}</span>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="mt-4 bg-white/10 rounded-xl p-4">
          <p className="text-red-200 text-xs uppercase tracking-wide">Current Balance</p>
          <div className="mt-1">
            <AmountDisplay amount={balance} size="lg" className="text-white text-3xl font-bold" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border border-red-100 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Level</p>
                <p className="text-xl font-bold text-red-700">{level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-100 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Team Size</p>
                <p className="text-xl font-bold text-red-700">{teamSize}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-100 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <AmountDisplay amount={earnings} size="sm" className="text-red-700 font-bold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-100 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Level Income</p>
                <AmountDisplay amount={levelIncome} size="sm" className="text-red-700 font-bold" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <LevelProgressCard level={level} teamSize={teamSize} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate({ to: '/deposit' })}
            className="h-14 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <ArrowDownLeft className="w-5 h-5" />
            Deposit
          </Button>
          <Button
            onClick={() => navigate({ to: '/withdraw' })}
            variant="outline"
            className="h-14 border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-2"
          >
            <ArrowUpRight className="w-5 h-5" />
            Withdraw
          </Button>
          <Button
            onClick={() => navigate({ to: '/levels' })}
            variant="outline"
            className="h-14 border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            View Levels
          </Button>
          <Button
            onClick={() => navigate({ to: '/transactions' })}
            variant="outline"
            className="h-14 border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-2"
          >
            <History className="w-5 h-5" />
            Transactions
          </Button>
        </div>
      </div>
    </div>
  );
}
