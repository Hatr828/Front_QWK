import { getJSON } from '$lib/api';

export type User = { id: number; name: string; email: string; role: string; avatarUrl?: string };
export type Summary = { completedTests: number; streakDays: number; avgScore: number; totalMinutes: number };
export type DailyPoint = { date: string; score: number };
export type LangItem = { language: string; percent: number };
export type TestItem = { id: number; title: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced'; topic: string };

// the same request in src/lib/api/auth.ts
export async function apiMe() {
  return getJSON<{ user: User } | User>('/api/me');
}
export async function apiSummary() {
  return getJSON<Summary>('/api/progress/summary');
}
export async function apiDaily(range = '30d') {
  return getJSON<{ points: DailyPoint[] } | DailyPoint[]>(`/api/progress/daily?range=${encodeURIComponent(range)}`);
}
export async function apiLangs() {
  return getJSON<{ items: LangItem[] } | LangItem[]>('/api/progress/language-distribution');
}
export async function apiRecommended(limit = 6) {
  return getJSON<{ items: TestItem[] } | TestItem[]>(`/api/tests/recommended?limit=${limit}`);
}