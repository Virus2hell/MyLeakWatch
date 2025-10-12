// Simple API helper for auth + credentials endpoints
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // use httpOnly cookie session/JWT
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export type CredentialMeta = {
  _id: string;
  site: string;
  username: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  // ciphertext data returned only when allowed
  encrypted?: {
    algo: 'AES-GCM';
    ivB64: string;
    saltB64: string;
    ctB64: string;
    iterations: number;
  };
};

export const AuthAPI = {
  getMe: () => api<{ user: { id: string; email: string; name?: string } }>('/api/auth/me'),
  googleLoginUrl: () => `${API_BASE}/api/auth/google`, // redirect
  logout: () => api<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
};

export const VaultAPI = {
  list: () => api<{ items: CredentialMeta[] }>('/api/credentials'),
  create: (payload: {
    site: string;
    username: string;
    note?: string;
    encrypted: any;
  }) => api<{ item: CredentialMeta }>('/api/credentials', { method: 'POST', body: JSON.stringify(payload) }),
  requestOtp: (id: string) => api<{ ok: true }>('/api/credentials/' + id + '/request-otp', { method: 'POST' }),
  verifyOtp: (id: string, code: string) =>
    api<{ item: CredentialMeta & { encrypted: CredentialMeta['encrypted'] } }>(
      '/api/credentials/' + id + '/verify-otp',
      { method: 'POST', body: JSON.stringify({ code }) },
    ),
};
