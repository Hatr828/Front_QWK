import { getJSON, postJSON } from '$lib/api';
import type { TestPayload, SubmitRequest, SubmitResult } from '$lib/types/test';
import type { TestMeta } from '$lib/types/test';

export async function apiFetchTest(id: string | number): Promise<TestPayload> {
  return getJSON<TestPayload>(`/api/tests/${id}`);
}

export async function apiSubmitTest(id: string | number, payload: SubmitRequest) {
  return postJSON<SubmitResult>(`/api/tests/${id}/submit`, payload);
}

export async function apiEvaluateCode(
  id: string | number,
  questionId: number,
  language: string,
  code: string
) {
  return postJSON<{ passed: boolean; output?: string; feedback?: string }>(
    `/api/tests/${id}/evaluate`,
    { questionId, language, code }
  );
}

export type ApiTestRow = {
  id: number;
  title: string;
  description?: string | null;
  difficulty?: TestMeta['difficulty'] | string;
  estimated_minutes?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function apiListTests(): Promise<TestMeta[]> {
  const rows = await getJSON<ApiTestRow[]>(`/api/tests`);
  return rows.map(
    (r): TestMeta => ({
      id: r.id,
      title: r.title,
      description: r.description ?? undefined,
      difficulty: (r.difficulty as TestMeta['difficulty']) ?? undefined,
      estimatedMinutes: r.estimated_minutes ?? undefined
    })
  );
}
