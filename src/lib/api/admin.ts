import { postJSON } from '$lib/api';
import type { AdminCreateTestFullRequest, AdminCreateTestFullResponse } from '$lib/types/admin';


export function apiCreateTestFull(payload: AdminCreateTestFullRequest) {
    return postJSON<AdminCreateTestFullResponse>('/api/admin/tests', payload);
}