"use client";

import { useEffect, useState } from 'react';

interface MissingSession {
  id: string;
  created_at?: string;
}

export default function SessionLinksAdminPage() {
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState<MissingSession[]>([]);
  const [backfilling, setBackfilling] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/journal-missing');
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load');
        setMissing(json.missing || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleBackfill = async () => {
    setBackfilling(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/admin/session-links/backfill', { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Backfill failed');
      setResult(`Scanned ${json.scanned}, linked ${json.linked}`);
    } catch (e: any) {
      setError(e?.message || 'Backfill failed');
    } finally {
      setBackfilling(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Session ↔ Journal Links</h1>

      <div className="mb-4">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          onClick={handleBackfill}
          disabled={backfilling}
        >
          {backfilling ? 'Backfilling…' : 'Backfill Links'}
        </button>
        {result && <div className="mt-2 text-green-600">{result}</div>}
        {error && <div className="mt-2 text-red-600">{error}</div>}
      </div>

      <h2 className="text-xl font-semibold mb-2">Missing Links</h2>
      {loading ? (
        <div>Loading…</div>
      ) : missing.length === 0 ? (
        <div>No sessions missing journal links 🎉</div>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {missing.map((s) => (
            <li key={s.id} className="text-sm">
              <span className="font-mono">{s.id}</span>
              {s.created_at ? <span className="ml-2 text-muted-foreground">{new Date(s.created_at).toLocaleString()}</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
