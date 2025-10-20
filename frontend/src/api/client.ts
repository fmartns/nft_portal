export const API_BASE: string =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export type HttpParams = Record<string, string | number | boolean | undefined | null>;

export function buildQuery(params?: HttpParams): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return '';
  const qp = new URLSearchParams();
  for (const [k, v] of entries) {
    qp.append(k, String(v));
  }
  return `?${qp.toString()}`;
}

export async function getJson<T>(path: string, params?: HttpParams, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}${buildQuery(params)}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function postJson<T>(path: string, body: any, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}
