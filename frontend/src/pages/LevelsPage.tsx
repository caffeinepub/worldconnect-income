import React from 'react';
import { useGetCallerUserProfile, useGetTotalTeamSize, useGetTotalLevelIncome } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, IndianRupee } from 'lucide-react';
import LevelProgressCard from '../components/levels/LevelProgressCard';
import LevelStructureTable from '../components/levels/LevelStructureTable';
import AmountDisplay from '../components/common/AmountDisplay';

export default function LevelsPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: totalTeamSize, isLoading: teamLoading } = useGetTotalTeamSize();
  const { data: totalLevelIncome, isLoading: levelIncomeLoading } = useGetTotalLevelIncome();

  const level = profile ? Number(profile.level) : 0;
  const teamSize = totalTeamSize ? Number(totalTeamSize) : 0;
  const levelIncome = totalLevelIncome ? Number(totalLevelIncome) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white shadow-red-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Level Income</h1>
            <p className="text-red-200 text-sm">Track your progress and unlock rewards</p>
          </div>
        </div>
      </div>

      {/* Level Income Summary Card */}
      <Card className="border border-red-100 shadow-sm bg-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Level Income Earned</p>
                {levelIncomeLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mt-1"></div>
                ) : (
                  <AmountDisplay amount={levelIncome} size="lg" className="text-red-700 text-2xl font-bold" />
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Current Level</p>
              <p className="text-2xl font-bold text-red-700">{level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {profileLoading || teamLoading ? (
        <div className="flex items-center justify-center min-h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <>
          <LevelProgressCard level={level} teamSize={teamSize} />
          <LevelStructureTable currentLevel={level} />
        </>
      )}
    </div>
  );
}
