import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { levelStructure } from '../../constants/levelStructure';
import AmountDisplay from '../common/AmountDisplay';

interface LevelStructureTableProps {
  currentLevel: number;
}

export default function LevelStructureTable({ currentLevel }: LevelStructureTableProps) {
  return (
    <Card className="border-purple-200 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">Complete Level Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-50 dark:bg-purple-900/20">
                <TableHead className="font-semibold">Level</TableHead>
                <TableHead className="font-semibold">Team Size Required</TableHead>
                <TableHead className="font-semibold">Reward</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {levelStructure.map((level) => {
                const isCurrentLevel = level.level === currentLevel;
                const isSpecialLevel = level.level === 9 || level.level === 10;

                return (
                  <TableRow
                    key={level.level}
                    className={`
                      ${isCurrentLevel ? 'bg-purple-100 dark:bg-purple-900/30 font-semibold' : ''}
                      ${isSpecialLevel && !isCurrentLevel ? 'bg-purple-50 dark:bg-purple-900/10' : ''}
                      hover:bg-purple-50/50 dark:hover:bg-purple-900/20
                    `}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isCurrentLevel && (
                          <img src="/assets/generated/level-badge.dim_128x128.png" alt="Current" className="h-5 w-5" />
                        )}
                        <span className={isCurrentLevel ? 'text-primary' : ''}>Level {level.level}</span>
                      </div>
                    </TableCell>
                    <TableCell>{level.teamSize.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      <AmountDisplay amount={level.reward} />
                      {isSpecialLevel && <span className="ml-2 text-xs text-purple-600">+ Tour Package</span>}
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
