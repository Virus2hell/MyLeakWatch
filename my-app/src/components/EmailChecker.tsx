// src/components/EmailChecker.tsx
import React, { useState } from 'react';

type Breach = {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  Description?: string;
  DataClasses?: string[];
};

export default function EmailChecker() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; breaches: Breach[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Server error');
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">Check if your email was leaked</h2>
      <form onSubmit={checkEmail} className="flex gap-2">
        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          required
          className="flex-1 px-3 py-2 border rounded"
        />
        <button disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded">
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {result && (
        <div className="mt-4">
          {result.found ? (
            <div>
              <h3 className="font-bold">Breached in {result.breaches.length} place(s):</h3>
              <ul className="mt-2 space-y-2">
                {result.breaches.map((b,i)=>(
                  <li key={i} className="p-3 border rounded">
                    <div className="font-semibold">{b.Title || b.Name}</div>
                    <div className="text-sm">{b.Domain} • {b.BreachDate}</div>
                    {b.DataClasses && <div className="text-sm mt-1">Leaked data: {b.DataClasses.join(', ')}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-2 text-green-700">Good news — no breaches found for this email (according to HIBP).</div>
          )}
        </div>
      )}
    </div>
  );
}
