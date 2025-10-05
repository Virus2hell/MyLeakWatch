// src/components/EmailChecker.tsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';

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
    <section id="emailSearch" className="min-h-screen bg-gradient-to-br bg-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              My
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              LeakWatch
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-12">
          <p className="text-xl sm:text-2xl text-gray-300 font-light">
            Check if your email address is in a data breach
          </p>
        </div>

      {/* Search Form */}
        <div className="mb-8">
          <form onSubmit={checkEmail} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Check
              </button>
            </div>
          </form>
        </div>

      {/* Error */}
      {error && <div className="mt-4 text-red-400">{error}</div>}

      {/* Results */}
      {result && (
        <div className="mt-8 w-full max-w-2xl text-left bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
          {result.found ? (
            <div>
              <h3 className="font-bold text-lg mb-3">
                ⚠️ Breached in {result.breaches.length} place(s):
              </h3>
              <ul className="space-y-3">
                {result.breaches.map((b,i)=>(
                  <li key={i} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="font-semibold text-blue-300">{b.Title || b.Name}</div>
                    <div className="text-sm text-gray-300">
                      {b.Domain} • {b.BreachDate}
                    </div>
                    {b.DataClasses && (
                      <div className="text-sm mt-1 text-gray-200">
                        Leaked data: {b.DataClasses.join(', ')}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-2 text-green-400 font-medium">
              ✅ Good news — no breaches found for this email.
            </div>
          )}
        </div>
      )}
    </div>
    </section>
  );
}
