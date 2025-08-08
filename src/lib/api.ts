import { PUBLIC_API_BASE } from '$env/static/public'; 

export async function postJSON<T>(path: string, body: unknown, init: RequestInit = {}): Promise<T> {
  const url = `${PUBLIC_API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    body: JSON.stringify(body),
    ...init
  });

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const data = await res.json();
      msg = (data?.message || data?.error || msg);
    } catch {
      try { msg = await res.text(); } catch {}
    }
    throw new Error(msg);
  }

  try { return (await res.json()) as T; }
  catch { return {} as T; }
}
