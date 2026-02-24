import React from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import LevelProgressCard from '../components/levels/LevelProgressCard';
import LevelStructureTable from '../components/levels/LevelStructureTable';
import { Card, CardContent } from '@/components/ui/card';

export default function LevelsPage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading level information...</p>
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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2 font-display">Level Income System</h1>
        <p className="text-purple-100">Track your progress and understand the reward structure</p>
      </div>

      {/* User Progress */}
      <LevelProgressCard userProfile={userProfile} />

      {/* Level Structure */}
      <LevelStructureTable currentLevel={Number(userProfile.level)} />
    </div>
  );
}
