import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { levelStructure } from '../../constants/levelStructure';

interface LevelStructureTableProps {
  currentLevel: number;
}

export default function LevelStructureTable({ currentLevel }: LevelStructureTableProps) {
  return (
    <Card className="border-red-100 shadow-red-sm">
      <CardHeader>
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <Trophy className="w-5 h-5 text-red-600" />
          Level Structure
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-red-50">
                <TableHead className="text-red-700">Level</TableHead>
                <TableHead className="text-red-700">Team Size</TableHead>
                <TableHead className="text-red-700">Reward</TableHead>
                <TableHead className="text-red-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levelStructure.map((levelData) => {
                const isCurrentLevel = levelData.level === currentLevel;
                const isAchieved = levelData.level < currentLevel;
                return (
                  <TableRow
                    key={levelData.level}
                    className={
                      isCurrentLevel
                        ? 'bg-red-50 border-l-4 border-l-red-600'
                        : isAchieved
                        ? 'bg-green-50/50'
                        : ''
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isCurrentLevel ? 'text-red-700' : ''}`}>
                          {levelData.level}
                        </span>
                        {isCurrentLevel && (
                          <Badge className="bg-red-600 text-white border-0 text-xs px-1.5 py-0">
                            Current
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={isCurrentLevel ? 'text-red-700 font-medium' : ''}>
                      {levelData.teamSize.toLocaleString()}
                    </TableCell>
                    <TableCell className={isCurrentLevel ? 'text-red-700 font-bold' : 'font-medium'}>
                      ₹{levelData.reward.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isCurrentLevel ? (
                        <Badge className="bg-red-100 text-red-700 border border-red-300 text-xs">
                          Active
                        </Badge>
                      ) : isAchieved ? (
                        <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs">
                          Achieved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Locked
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
