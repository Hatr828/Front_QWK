export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type IoCase = { args: unknown[]; expect?: unknown; throws?: boolean };

export type CodeIoTests = {
    type: 'io';
    function: string;
    equality?: 'deep' | 'strict';
    timeoutMs?: number;
    cases: IoCase[];
};


export type AdminTestDraft = {
    title: string;
    description?: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | '';
    estimatedMinutes?: number | string;
};


export type AdminMCQOptionDraft = {
    text: string;
    correct: boolean;
};


export type AdminMCQDraft = {
    type: 'mcq';
    title: string;
    prompt: string;
    multiple: boolean;
    options: AdminMCQOptionDraft[];
};


export type AdminCodeDraft = {
    type: 'code';
    title: string;
    prompt: string;
    language: string;
    starter?: string;
    tests?: CodeIoTests;
};

export type AdminQuestionDraft = AdminMCQDraft | AdminCodeDraft;

export type AdminCreateTestFullRequest = {
    test: {
        title: string;
        description?: string;
        difficulty?: Difficulty;
        estimatedMinutes?: number;
    };
    questions: (
        | {
            type: 'mcq';
            title: string;
            prompt: string;
            multiple: boolean;
            options: string[];
            correct: number[];
        }
        | {
            type: 'code';
            title: string;
            prompt: string;
            language: string;
            starter?: string;
            tests?: CodeIoTests;
        }
    )[];
};


export type AdminCreateTestFullResponse = {
    test: { id: number | string; title: string };
};