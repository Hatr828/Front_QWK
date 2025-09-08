import { env as publicEnv } from '$env/dynamic/public';

const API_BASE = publicEnv.PUBLIC_API_BASE ?? '';

let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(handler: () => void) { onUnauthorized = handler; }

export function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('token');
}
export function setToken(token: string) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('token', token);
}
export function clearToken() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function withAuthHeaders(init: RequestInit = {}): RequestInit {
  const token = getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as any || {})
  };

  if (!(init.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
  }
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return { ...init, headers };
}

async function handle<T>(res: Response): Promise<T> {
  if (res.status === 401 && onUnauthorized) onUnauthorized();
  if (!res.ok) {
    let msg = res.statusText;
    try { const data = await res.json(); msg = (data?.message || (data as any)?.error || msg); }
    catch { try { msg = await res.text(); } catch {} }
    throw new Error(msg);
  }
  try { return await res.json() as T; } catch { return {} as T; }
}

export async function getJSON<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, withAuthHeaders({ ...init, method: 'GET' }));
  return handle<T>(res);
}

export async function postJSON<T>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const opts: RequestInit = { ...init, method: 'POST' };

  if (body !== undefined) {
    if (body instanceof FormData) {
      opts.body = body; 
      const h = new Headers(opts.headers as any);
      h.delete('Content-Type');
      opts.headers = h;
    } else {
      opts.body = JSON.stringify(body);
    }
  }

  const res = await fetch(url, withAuthHeaders(opts));
  return handle<T>(res);
}

export async function putJSON<T>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
  return postJSON<T>(path, body, { ...init, method: 'PUT' });
}

export async function patchJSON<T>(path: string, body?: unknown, init: RequestInit = {}): Promise<T> {
  return postJSON<T>(path, body, { ...init, method: 'PATCH' });
}

export async function delJSON<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, withAuthHeaders({ ...init, method: 'DELETE' }));
  return handle<T>(res);
}