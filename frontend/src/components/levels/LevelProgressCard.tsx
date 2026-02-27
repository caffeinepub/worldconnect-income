import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Users } from 'lucide-react';
import { levelStructure } from '../../constants/levelStructure';

interface LevelProgressCardProps {
  level: number;
  teamSize: number;
}

export default function LevelProgressCard({ level, teamSize }: LevelProgressCardProps) {
  const currentLevelData = levelStructure[level - 1];
  const nextLevelData = levelStructure[level];

  const nextThreshold = nextLevelData?.teamSize ?? currentLevelData?.teamSize ?? 0;

  const progress = nextLevelData
    ? Math.min(100, Math.round((teamSize / nextThreshold) * 100))
    : 100;

  return (
    <Card className="border-red-100 shadow-red-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            Level Progress
          </CardTitle>
          <Badge className="bg-red-600 text-white border-0 flex items-center gap-1">
            <Star className="w-3 h-3 fill-white" />
            Level {level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Team: {teamSize}
            </span>
            <span>
              {nextLevelData ? `Next: ${nextThreshold} members` : 'Max Level Reached!'}
            </span>
          </div>
          <Progress
            value={progress}
            className="h-3 bg-red-100 [&>div]:bg-red-600"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% complete</p>
        </div>

        {/* Current Level Reward */}
        {currentLevelData && (
          <div className="bg-red-50 rounded-lg p-3 border border-red-100">
            <p className="text-xs text-red-600 font-medium">Current Level Reward</p>
            <p className="text-lg font-bold text-red-700">₹{currentLevelData.reward.toLocaleString()}</p>
          </div>
        )}

        {/* Next Level Info */}
        {nextLevelData && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground font-medium">Next Level ({level + 1}) Reward</p>
            <p className="text-base font-bold text-foreground">₹{nextLevelData.reward.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Need {Math.max(0, nextThreshold - teamSize)} more members
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
