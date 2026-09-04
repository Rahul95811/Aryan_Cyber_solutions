'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const checklistItems = [
  "I understand this is a 45-minute continuous assessment.",
  "I understand the assessment contains 30 questions.",
  "I understand the assessment has 10 Networks, 10 Linux, and 10 Written questions.",
  "I understand AI tools, search engines, notes, and outside assistance are not permitted.",
  "I understand fullscreen and focus events may be monitored.",
  "I understand three qualifying integrity violations may temporarily lock my assessment.",
  "I understand detected integrity events may be reviewed by the training team.",
  "I will complete this assessment independently and honestly."
];

export default function RulesClient({ candidateId, candidateName }: { candidateId: string; candidateName: string }) {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(checklistItems.length).fill(false));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allChecked = checkedItems.every(Boolean);

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

  async function handleStart() {
    if (!allChecked) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/training/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          router.push(`/training/submitted`);
          return;
        }
        setError(data.message ?? 'Failed to start assessment. Please try again.');
        setLoading(false);
        return;
      }

      router.push(`/training/assessment`);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  }

  return (
    <section className="mt-12 rounded-2xl border border-cyber-500/30 bg-cyber-500/5 p-6 sm:p-8">
      <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-white">Before You Start</h2>
      
      <div className="mb-8 space-y-3">
        {checklistItems.map((item, idx) => (
          <label key={idx} className="flex cursor-pointer items-start gap-4 rounded-xl border border-white/5 bg-black/20 p-4 transition-colors hover:bg-black/40">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={checkedItems[idx]}
                onChange={() => toggleCheck(idx)}
                className="peer sr-only"
              />
              <div className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
                checkedItems[idx] ? 'border-cyber-500 bg-cyber-500' : 'border-white/30 bg-transparent'
              }`}>
                {checkedItems[idx] && (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="type-body select-none text-white/80">{item}</span>
          </label>
        ))}
      </div>

      {error && (
        <p className="type-label mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleStart}
          disabled={!allChecked || loading}
          className="btn-primary w-full max-w-md py-4 text-lg disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Starting Assessment...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              START ASSESSMENT
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </button>
        <p className="mt-4 text-center text-sm font-semibold text-amber-500">
          Once started, your 45-minute timer begins. The assessment cannot be paused.
        </p>

        <p className="mt-8 text-center text-xs text-white/30">
          Candidate: <span className="text-white/50">{candidateName}</span>
          &ensp;·&ensp;
          ID: <span className="font-mono text-cyber-400/80">{candidateId}</span>
        </p>
      </div>
    </section>
  );
}
