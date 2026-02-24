export interface LevelConfig {
  level: number;
  teamSize: number;
  reward: number;
}

export const levelStructure: LevelConfig[] = [
  { level: 1, teamSize: 10, reward: 100 },
  { level: 2, teamSize: 20, reward: 500 },
  { level: 3, teamSize: 40, reward: 1000 },
  { level: 4, teamSize: 80, reward: 2500 },
  { level: 5, teamSize: 160, reward: 3500 },
  { level: 6, teamSize: 320, reward: 4500 },
  { level: 7, teamSize: 640, reward: 7000 },
  { level: 8, teamSize: 1280, reward: 10000 },
  { level: 9, teamSize: 2560, reward: 15000 },
  { level: 10, teamSize: 5120, reward: 25000 },
];

export function getLevelConfig(level: number): LevelConfig {
  return levelStructure.find((l) => l.level === level) || levelStructure[0];
}

export function getNextLevelConfig(currentLevel: number): LevelConfig | null {
  return levelStructure.find((l) => l.level === currentLevel + 1) || null;
}
