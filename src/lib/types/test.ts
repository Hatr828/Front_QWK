export type MCQOption = { id: number; text: string };

export type MCQQuestion = {
  id: number;
  type: 'mcq';
  title: string;
  prompt: string;
  multiple: boolean;
  options: MCQOption[];
};

export type CodeQuestion = {
  id: number;
  type: 'code';
  title: string;
  prompt: string;
  language: 'javascript' | 'typescript' | 'python' | 'cpp' | 'java' | 'rust' | string;
  starter?: string;
};

export type AnyQuestion = MCQQuestion | CodeQuestion;

export type TestMeta = {
  id: number | string;
  title: string;
  description?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes?: number;
};

export type TestPayload = {
  test: TestMeta;
  questions: AnyQuestion[];
};

export type SubmitAnswer =
  | { questionId: number; type: 'mcq'; selected: number[] }
  | { questionId: number; type: 'code'; language: string; code: string };

export type SubmitRequest = {
  test: TestMeta;
  questions: AnyQuestion[];
  answers: SubmitAnswer[];
};

export type SubmitResult = {
  scorePercent: number;
  results?: Array<{
    questionId: number;
    correct?: boolean;
    feedback?: string;
  }>;
};