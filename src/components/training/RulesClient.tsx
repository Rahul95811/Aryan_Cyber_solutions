'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RulesClient({ candidateId, candidateName }: { candidateId: string; candidateName: string }) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleStart() {
    if (!agreed) return;
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
          // Already submitted — redirect to submitted page
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
    <div className="flex flex-col gap-6">
      {/* Integrity Declaration */}
      <div className="rounded-xl border border-cyber-500/30 bg-cyber-500/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyber-500/15">
            <svg className="h-5 w-5 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="type-sub text-white">Academic Integrity Declaration</h3>
        </div>

        <div className="type-body space-y-3 text-white/70">
          <p>
            This assessment must be completed <strong className="text-white">independently</strong>, using your own knowledge and thinking.
          </p>
          <p>
            The use of AI tools — including <strong className="text-white/90">ChatGPT, Gemini, Claude, Copilot</strong>, or any AI-powered assistant — is <strong className="text-red-400">not permitted</strong> during this assessment.
          </p>
          <p>
            The use of search engines, textbooks, or notes is also not permitted.
          </p>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-white/80 italic">
              &ldquo;We are not trying to test what you can find online. We want to understand how you think, what you already know, and how you reason through problems. Honest responses — including &lsquo;I don&rsquo;t know&rsquo; — are far more valuable to us than AI-generated answers.&rdquo;
            </p>
          </div>
          <p>
            Written responses that appear to be AI-generated will result in disqualification. By starting this assessment, you confirm that you will complete it <strong className="text-white">independently and honestly</strong>.
          </p>
        </div>

        {/* Checkbox */}
        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <div className="relative mt-0.5 shrink-0">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
              id="integrity-agree"
            />
            <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
              agreed ? 'border-cyber-500 bg-cyber-500' : 'border-white/30 bg-transparent'
            }`}>
              {agreed && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="type-body text-white/80">
            I have read the assessment rules and integrity declaration, and I agree to complete this assessment independently and honestly.
          </span>
        </label>
      </div>

      {error && (
        <p className="type-label rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Start Button */}
      <button
        type="button"
        onClick={handleStart}
        disabled={!agreed || loading}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Starting Assessment...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Start 45-Minute Assessment
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        )}
      </button>

      {!agreed && (
        <p className="type-label text-center text-white/40">
          Please read and accept the integrity declaration to enable the Start button.
        </p>
      )}

      <p className="type-label text-center text-white/30">
        Candidate: <span className="text-white/50">{candidateName}</span>
        &ensp;·&ensp;
        ID: <span className="font-mono text-cyber-400/80">{candidateId}</span>
      </p>
    </div>
  );
}
