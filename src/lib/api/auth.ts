import { getJSON } from '$lib/api';

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
};

export async function apiMe(): Promise<User> {
    const raw = await getJSON<any>('/api/me');
    const u = raw?.user ?? raw;
    if (!u || typeof u !== 'object') throw new Error('Malformed /api/me response');
    return u as User;
}
