import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { levelStructure } from '../../constants/levelStructure';
import type { UserProfile } from '../../backend';
import AmountDisplay from '../common/AmountDisplay';

interface LevelProgressCardProps {
  userProfile: UserProfile;
}

export default function LevelProgressCard({ userProfile }: LevelProgressCardProps) {
  const currentLevel = Number(userProfile.level);
  const currentLevelData = levelStructure[currentLevel - 1];
  const nextLevelData = levelStructure[currentLevel];

  const currentTeamSize = 0;
  const targetTeamSize = nextLevelData?.teamSize || currentLevelData.teamSize;
  const progress = nextLevelData ? (currentTeamSize / targetTeamSize) * 100 : 100;

  return (
    <Card className="border-purple-200 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <img src="/assets/generated/level-badge.dim_128x128.png" alt="Level Badge" className="h-8 w-8" />
          Level {currentLevel} Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Level</p>
            <p className="text-2xl font-bold text-primary">Level {currentLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Current Reward</p>
            <AmountDisplay amount={currentLevelData.reward} size="md" />
          </div>
        </div>

        {nextLevelData && (
          <>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Team Size Progress</span>
                <span className="font-medium text-primary">
                  {currentTeamSize} / {targetTeamSize}
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-purple-100" />
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-muted-foreground mb-2">Next Level Reward</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-primary">Level {currentLevel + 1}</p>
                  <p className="text-xs text-muted-foreground">Team Size: {nextLevelData.teamSize}</p>
                </div>
                <AmountDisplay amount={nextLevelData.reward} size="lg" />
              </div>
            </div>
          </>
        )}

        {!nextLevelData && (
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg text-center border border-purple-200">
            <p className="text-lg font-bold text-primary mb-2">🎉 Maximum Level Reached!</p>
            <p className="text-sm text-muted-foreground">
              Congratulations! You've achieved the highest level in the system.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
