// src/components/ImageSearch.tsx
import React, { useState } from 'react';

export default function ImageSearch() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const resp = await fetch('/api/check-image', { method: 'POST', body: fd });
      const data = await resp.json();
      if (!resp.ok) setError(data.error || 'visual search failed');
      else setResults(data.results);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-3">Find where your image appears online</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input type="file" accept="image/*" onChange={onFile} />
        {preview && <img src={preview} alt="preview" style={{ maxWidth: 240 }} />}
        <div>
          <button disabled={loading || !file} className="px-4 py-2 bg-slate-800 text-white rounded">
            {loading ? 'Searching...' : 'Search Image'}
          </button>
        </div>
      </form>

      {error && <div className="mt-3 text-red-600">{error}</div>}

      {results && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">Top results (raw response)</h4>
          <pre className="text-xs max-h-96 overflow-auto p-2 bg-slate-100 rounded">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
