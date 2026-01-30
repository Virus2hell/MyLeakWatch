// src/components/ImageSearch.tsx
import React, { useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';

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
      if (!resp.ok) setError(data.error || 'Visual search failed');
      else setResults(data.results);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id='imageSearch' className="min-h-screen bg-gradient-to-br bg-[#0b0f1a] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center text-center py-20 px-4">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Image Search
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-12">
          <p className="text-xl sm:text-2xl text-gray-300 font-light">
            Find where your image appears online
          </p>
        </div>

        {/* Upload Form */}
        <div className="mb-8 w-full max-w-2xl">
          <form onSubmit={onSubmit} className="flex flex-col gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-6 cursor-pointer hover:border-blue-400 transition">
              <Upload className="h-10 w-10 text-gray-300 mb-2" />
              <span className="text-gray-300">Click or drag & drop to upload an image</span>
              <input type="file" accept="image/*" onChange={onFile} className="hidden" />
            </label>

            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="preview"
                  className="mx-auto max-h-64 rounded-xl shadow-lg border border-white/10"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              {loading ? 'Searching...' : 'Search Image'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && <div className="mt-4 text-red-400">{error}</div>}

        {/* Results */}
        {results && (
          <div className="mt-8 w-full max-w-2xl text-left bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
            <h3 className="font-bold text-lg mb-3">📷 Top results</h3>
            <pre className="text-sm max-h-96 overflow-auto p-4 bg-white/5 rounded-lg border border-white/10">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
