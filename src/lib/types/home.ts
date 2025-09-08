export type Point = { date: string; score: number };
export type Slice = { language: string; percent: number };

export type User = { id: number; name: string; email: string; role: string; avatarUrl?: string };
export type Summary = { completedTests: number; streakDays: number; avgScore: number; totalMinutes: number };

export type TestItem = {
  id: number;
  title: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
};
