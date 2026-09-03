'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  networkQuestions,
  linuxQuestions,
  writtenQuestions,
  type MCQQuestion,
  type WrittenQuestion,
  type AnyQuestion,
} from '@/lib/questions';

// ─── Types ────────────────────────────────────────────────────

type Section = 'networks' | 'networks_review' | 'linux' | 'linux_review' | 'written' | 'final_review';

interface Answers {
  mcq: Record<string, number>;      // questionId → option index
  written: Record<string, string>;  // questionId → text
}

export interface IntegrityEvent {
  type: 'tab_hidden' | 'tab_visible' | 'copy_attempt' | 'cut_attempt' | 'paste_attempt' | 'fullscreen_exit' | 'context_menu';
  timestamp: string;
  durationMs?: number;
}

interface Props {
  candidateId: string;
  candidateName: string;
  deadlineTimestamp: number; // ms — absolute server-anchored deadline
  initialDraft?: Answers | null;
}

// ─── Timer hook ───────────────────────────────────────────────

function useCountdown(deadlineTimestamp: number) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.floor((deadlineTimestamp - Date.now()) / 1000))
  );

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      const secs = Math.max(0, Math.floor((deadlineTimestamp - Date.now()) / 1000));
      setRemaining(secs);
    }, 500);
    return () => clearInterval(id);
  }, [deadlineTimestamp, remaining]);

  return remaining;
}

// ─── Timer Display ────────────────────────────────────────────

function TimerDisplay({ remaining }: { remaining: number }) {
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const urgent = remaining <= 60;
  const warning = remaining <= 300 && remaining > 60;

  return (
    <div className={`flex flex-col items-center ${urgent ? 'animate-pulse' : ''}`}>
      <span
        className={`font-mono text-2xl font-bold tracking-widest lg:text-3xl ${
          urgent ? 'text-red-400' : warning ? 'text-amber-400' : 'text-white'
        }`}
        aria-live={urgent ? 'assertive' : warning ? 'polite' : 'off'}
        aria-label={`${mins} minutes ${secs} seconds remaining`}
      >
        {display}
      </span>
      <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${
        urgent ? 'text-red-400/70' : warning ? 'text-amber-400/70' : 'text-white/40'
      }`}>
        {urgent ? 'SUBMITTING SOON' : warning ? 'TIME RUNNING LOW' : 'TIME REMAINING'}
      </span>
    </div>
  );
}



// ─── Progress Bar ─────────────────────────────────────────────

function ProgressBar({ answered, total }: { answered: number; total: number }) {
  const pct = Math.round((answered / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyber-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="type-label shrink-0 font-mono text-white/40">{answered}/{total}</span>
    </div>
  );
}

// ─── MCQ Card ────────────────────────────────────────────────

function MCQCard({
  q,
  selected,
  flagged,
  onSelect,
  onFlag,
  onClear,
}: {
  q: MCQQuestion;
  selected: number | undefined;
  flagged: boolean;
  onSelect: (idx: number) => void;
  onFlag: () => void;
  onClear: () => void;
}) {
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className={`rounded-2xl border bg-white/[0.03] p-5 transition-colors sm:p-6 ${
      selected !== undefined ? 'border-cyber-500/30' : 'border-white/10'
    }`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyber-400">
            Q{q.questionNumber}
          </span>
          {selected !== undefined && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyber-500/20">
              <svg className="h-3 w-3 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selected !== undefined && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear answer"
              className="type-label flex items-center px-2 py-1 text-xs font-medium text-white/40 transition-colors hover:text-white"
            >
              Clear Answer
            </button>
          )}
          <button
            type="button"
            onClick={onFlag}
          aria-label={flagged ? 'Remove flag' : 'Flag for review'}
          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
            flagged
              ? 'bg-amber-400/15 text-amber-400'
              : 'text-white/30 hover:bg-white/5 hover:text-white/60'
          }`}
        >
          <svg className="h-3.5 w-3.5" fill={flagged ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
          {flagged ? 'Flagged' : 'Flag'}
        </button>
        </div>
      </div>

      {/* Question text — handle newlines (for command display) */}
      <p className="type-body mb-5 whitespace-pre-line text-white/90">{q.question}</p>

      {/* Options */}
      <div className="flex flex-col gap-2.5">
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(idx)}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-150 ${
                isSelected
                  ? 'border-cyber-500/60 bg-cyber-500/15 text-white'
                  : 'border-white/8 bg-white/[0.02] text-white/70 hover:border-white/20 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                isSelected
                  ? 'border-cyber-400/60 bg-cyber-500/30 text-cyber-300'
                  : 'border-white/15 bg-white/5 text-white/40'
              }`}>
                {labels[idx]}
              </span>
              <span className="type-body flex-1 leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Written Card ─────────────────────────────────────────────

function WrittenCard({
  q,
  value,
  onChange,
  onPasteAttempt,
}: {
  q: WrittenQuestion;
  value: string;
  onChange: (v: string) => void;
  onPasteAttempt: () => void;
}) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className={`rounded-2xl border p-5 transition-colors sm:p-6 ${
      value.trim() ? 'border-cyber-500/20 bg-white/[0.03]' : 'border-white/10 bg-white/[0.02]'
    }`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyber-400">
          W{q.questionNumber}
        </span>
        <span className="type-label text-white/30">Written Response</span>
      </div>

      <p className="type-body mb-4 text-white/90">{q.question}</p>

      <div className="relative">
        <textarea
          id={`written-${q.id}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          maxLength={5000}
          placeholder="Write your response here in your own words..."
          className="type-body w-full resize-none rounded-xl border border-white/10 bg-navy-900/50 px-4 py-3 text-white outline-none transition-colors focus:border-cyber-500/40 placeholder-white/20"
          style={{ minHeight: '120px' }}
          suppressHydrationWarning
          autoComplete="off"
          autoCorrect="off"
          spellCheck={true}
          onPaste={(e) => {
            e.preventDefault();
            onPasteAttempt();
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className={`type-label text-xs ${
          wordCount >= 50 ? 'text-green-400/70' : 'text-white/30'
        }`}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
          {wordCount < 50 && wordCount > 0 && ' · aim for at least 50 words'}
          {wordCount >= 50 && ' · good'}
        </span>
        <span className="type-label text-xs text-white/20">
          {5000 - value.length} chars remaining
        </span>
      </div>
    </div>
  );
}

// ─── Quick Navigator ──────────────────────────────────────────

function QuickNavigator({
  questions,
  currentIdx,
  answers,
  flagged,
  onSelect,
}: {
  questions: AnyQuestion[];
  currentIdx: number;
  answers: Answers;
  flagged: Set<string>;
  onSelect: (idx: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="type-label font-bold uppercase tracking-widest text-white/50">Quick Access</h3>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIdx;
          const isAnswered = q.section === 'written' 
            ? !!answers.written[q.id]?.trim() 
            : answers.mcq[q.id] !== undefined;
          const isFlagged = flagged.has(q.id);

          let baseStyle = 'border-white/10 bg-white/[0.02] text-white/40 hover:bg-white/[0.05]';
          if (isCurrent) {
            baseStyle = 'border-cyber-500/50 bg-cyber-500/20 text-white';
          } else if (isAnswered) {
            baseStyle = 'border-cyber-500/30 bg-cyber-500/10 text-cyber-300 hover:bg-cyber-500/20';
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              className={`relative flex h-11 w-full items-center justify-center rounded-lg border text-sm font-bold transition-all sm:h-12 ${baseStyle}`}
              aria-label={`Question ${idx + 1}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {q.section === 'written' ? `W${idx + 1}` : idx + 1}
              {isFlagged && (
                <div className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 shadow-md">
                  <svg className="h-2.5 w-2.5 text-navy-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest sm:text-xs">
        <div className="flex items-center gap-1.5 text-white/40"><div className="h-2.5 w-2.5 rounded-full border border-white/20 bg-white/5" /> Unanswered</div>
        <div className="flex items-center gap-1.5 text-cyber-400"><div className="h-2.5 w-2.5 rounded-full border border-cyber-500/50 bg-cyber-500/20" /> Answered</div>
        <div className="flex items-center gap-1.5 text-amber-400"><div className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Flagged</div>
      </div>
    </div>
  );
}

// ─── Section Review ───────────────────────────────────────────

function SectionReview({
  sectionTitle,
  questions,
  answers,
  flagged,
  onReturnToQuestion,
  onContinue,
  continueLabel,
}: {
  sectionTitle: string;
  questions: AnyQuestion[];
  answers: Answers;
  flagged: Set<string>;
  onReturnToQuestion: (idx: number) => void;
  onContinue: () => void;
  continueLabel: string;
}) {
  const answeredCount = questions.filter(q => 
    q.section === 'written' ? !!answers.written[q.id]?.trim() : answers.mcq[q.id] !== undefined
  ).length;
  const flaggedCount = questions.filter(q => flagged.has(q.id)).length;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-navy-900/50 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <h2 className="type-sub mb-2 text-white">{sectionTitle} Complete</h2>
      <p className="type-body mb-6 text-white/50">You may review these questions before continuing.</p>
      
      <div className="mb-8 flex gap-4">
        <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
          <div className="text-2xl font-bold text-cyber-400">{answeredCount} / {questions.length}</div>
          <div className="text-xs uppercase tracking-wider text-white/40">Answered</div>
        </div>
        <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{flaggedCount}</div>
          <div className="text-xs uppercase tracking-wider text-white/40">Flagged</div>
        </div>
      </div>

      <div className="mb-8 space-y-2">
        {questions.map((q, idx) => {
          const isAnswered = q.section === 'written' ? !!answers.written[q.id]?.trim() : answers.mcq[q.id] !== undefined;
          const isFlagged = flagged.has(q.id);
          return (
            <button
              key={q.id}
              onClick={() => onReturnToQuestion(idx)}
              className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-white/50">
                  {q.section === 'written' ? `W${q.questionNumber}` : `Q${q.questionNumber}`}
                </span>
                {isAnswered ? (
                  <span className="text-sm font-medium text-cyber-400">Answered</span>
                ) : (
                  <span className="text-sm text-white/30">Unanswered</span>
                )}
              </div>
              {isFlagged && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                  Flagged
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={() => onReturnToQuestion(0)} className="btn-secondary flex-1">
          Review from Q1
        </button>
        <button onClick={onContinue} className="btn-primary flex-1">
          {continueLabel} &rarr;
        </button>
      </div>
    </div>
  );
}

// ─── Final Review ─────────────────────────────────────────────

function FinalReview({
  answers,
  flagged,
  onReturnToSection,
  onSubmit,
  submitting,
}: {
  answers: Answers;
  flagged: Set<string>;
  onReturnToSection: (section: Section) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const networksCount = networkQuestions.filter(q => answers.mcq[q.id] !== undefined).length;
  const networksFlagged = networkQuestions.filter(q => flagged.has(q.id)).length;
  
  const linuxCount = linuxQuestions.filter(q => answers.mcq[q.id] !== undefined).length;
  const linuxFlagged = linuxQuestions.filter(q => flagged.has(q.id)).length;

  const writtenCount = writtenQuestions.filter(q => !!answers.written[q.id]?.trim()).length;
  const totalAnswered = networksCount + linuxCount + writtenCount;

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-navy-900/50 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
      <h2 className="type-sub mb-2 text-white">Final Review</h2>
      <p className="type-body mb-6 text-white/50">Review your progress before submitting the assessment.</p>
      
      <div className="mb-8 flex flex-col gap-4">
        {[
          { key: 'networks' as Section, title: 'Computer Networks', count: networksCount, flagged: networksFlagged, total: 10 },
          { key: 'linux' as Section, title: 'Linux Fundamentals', count: linuxCount, flagged: linuxFlagged, total: 10 },
          { key: 'written' as Section, title: 'Written Responses', count: writtenCount, flagged: 0, total: 10 },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => onReturnToSection(s.key)}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left hover:bg-white/[0.05] transition-colors"
          >
            <div>
              <div className="type-label mb-1 font-semibold text-white">{s.title}</div>
              <div className="text-sm text-white/50">
                <span className="text-cyber-400">{s.count}</span> / {s.total} answered
              </div>
            </div>
            {s.flagged > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
                {s.flagged} flagged
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-col items-center rounded-xl border border-white/5 bg-black/20 py-4">
        <span className="text-3xl font-bold text-white">{totalAnswered} <span className="text-xl text-white/30">/ 30</span></span>
        <span className="text-xs uppercase tracking-wider text-white/50">Total Answered</span>
      </div>

      <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
        <p className="type-label text-amber-400/90">
          Once submitted, you cannot change your answers. This action is final.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={() => onReturnToSection('networks')} className="btn-secondary flex-1">
          Return to Assessment
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="btn-primary flex-1 disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Assessment Engine ───────────────────────────────────

export default function AssessmentEngine({
  candidateId,
  candidateName,
  deadlineTimestamp,
  initialDraft,
}: Props) {
  const router = useRouter();
  const remaining = useCountdown(deadlineTimestamp);

  const [currentSection, setCurrentSection] = useState<Section>('networks');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => ({
    mcq: initialDraft?.mcq ?? {},
    written: initialDraft?.written ?? {},
  }));
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const hasAutoSubmitted = useRef(false);
  const focusEvents = useRef<{ event: string; timestamp: string }[]>([]);

  // ── Integrity State ──────────────────────────────────────────
  const [hasStarted, setHasStarted] = useState(false);
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);
  const [integrityWarning, setIntegrityWarning] = useState('');
  const tabHiddenTime = useRef<number>(0);

  const recordIntegrityEvent = useCallback((type: IntegrityEvent['type'], durationMs?: number) => {
    setIntegrityEvents(prev => [...prev, { type, timestamp: new Date().toISOString(), durationMs }]);
    if (type === 'fullscreen_exit') {
      setIntegrityWarning('Fullscreen exited. Please remain focused on the assessment. This activity has been recorded.');
      setTimeout(() => setIntegrityWarning(''), 5000);
    }
  }, []);

  // ── Answer helpers ────────────────────────────────────────

  const setMCQ = useCallback((qid: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, mcq: { ...prev.mcq, [qid]: idx } }));
  }, []);

  const clearMCQ = useCallback((qid: string) => {
    setAnswers((prev) => {
      const nextMcq = { ...prev.mcq };
      delete nextMcq[qid];
      return { ...prev, mcq: nextMcq };
    });
  }, []);

  const setWritten = useCallback((qid: string, text: string) => {
    setAnswers((prev) => ({ ...prev, written: { ...prev.written, [qid]: text } }));
  }, []);

  const toggleFlag = useCallback((qid: string) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(qid) ? next.delete(qid) : next.add(qid);
      return next;
    });
  }, []);

  // ── Answer counts ─────────────────────────────────────────

  const answeredCount = {
    networks: networkQuestions.filter((q) => answers.mcq[q.id] !== undefined).length,
    linux: linuxQuestions.filter((q) => answers.mcq[q.id] !== undefined).length,
    written: writtenQuestions.filter((q) => answers.written[q.id]?.trim()).length,
  };
  const totalAnswered = answeredCount.networks + answeredCount.linux + answeredCount.written;

  // ── Auto-save to localStorage every 15s ──────────────────

  useEffect(() => {
    const id = setInterval(() => {
      try {
        localStorage.setItem(`acs_draft_${candidateId}`, JSON.stringify({ ...answers, savedAt: new Date().toISOString() }));
      } catch { /* ignore quota errors */ }
    }, 15_000);
    return () => clearInterval(id);
  }, [answers, candidateId]);

  // ── Sync draft to server every 60s ───────────────────────

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        await fetch('/api/training/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers }),
        });
      } catch { /* silent — localStorage is backup */ }
    }, 60_000);
    return () => clearInterval(id);
  }, [answers, candidateId]);

  // ── Tab visibility tracking (context for reviewer) ───────

  useEffect(() => {
    const onVisChange = () => {
      if (!hasStarted) return;
      if (document.hidden) {
        tabHiddenTime.current = Date.now();
        recordIntegrityEvent('tab_hidden');
      } else {
        const durationMs = tabHiddenTime.current > 0 ? Date.now() - tabHiddenTime.current : undefined;
        recordIntegrityEvent('tab_visible', durationMs);
        setIntegrityWarning('Assessment window changed. Please return to the assessment. This activity has been recorded.');
        setTimeout(() => setIntegrityWarning(''), 5000);
      }
    };
    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, [hasStarted, recordIntegrityEvent]);

  // ── Fullscreen tracking ──────────────────────────────────
  useEffect(() => {
    const onFullScreenChange = () => {
      if (!document.fullscreenElement && hasStarted) {
        recordIntegrityEvent('fullscreen_exit');
      }
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, [hasStarted, recordIntegrityEvent]);

  // ── Clipboard & Context Menu Restrictions ────────────────
  const handleCopy = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    recordIntegrityEvent('copy_attempt');
  }, [recordIntegrityEvent]);

  const handleCut = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    recordIntegrityEvent('cut_attempt');
  }, [recordIntegrityEvent]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    recordIntegrityEvent('context_menu');
  }, [recordIntegrityEvent]);

  // ── Prevent accidental navigation ────────────────────────

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // ── Submit function ───────────────────────────────────────

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');

    const payload = {
      mcqAnswers: answers.mcq,
      writtenAnswers: answers.written,
      autoSubmit: auto,
      integrityEvents,
    };

    try {
      const res = await fetch('/api/training/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 409) {
        // Clear local draft
        try { localStorage.removeItem(`acs_draft_${candidateId}`); } catch { /* ignore */ }
        router.push('/training/submitted');
        return;
      }

      const data = await res.json();
      setSubmitError(data.message ?? 'Submission failed. Please try again.');
      setSubmitting(false);
    } catch {
      if (auto) {
        setSubmitError('Network disconnected. Retrying submission in background... Please do not close this tab.');
        try {
          localStorage.setItem(`acs_pending_submit_${candidateId}`, JSON.stringify(payload));
        } catch {}
        
        const retryInterval = setInterval(async () => {
          if (navigator.onLine) {
            try {
              const retryRes = await fetch('/api/training/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              if (retryRes.ok || retryRes.status === 409) {
                clearInterval(retryInterval);
                try {
                  localStorage.removeItem(`acs_draft_${candidateId}`);
                  localStorage.removeItem(`acs_pending_submit_${candidateId}`);
                } catch {}
                router.push('/training/submitted');
              }
            } catch { /* still failing */ }
          }
        }, 5000);
      } else {
        setSubmitError('Network error. Please check your connection and try again.');
        setSubmitting(false);
      }
    }
  }, [submitting, candidateId, answers, router, integrityEvents]);

  // ── Auto-submit when timer hits 0 ────────────────────────

  useEffect(() => {
    if (remaining <= 0 && !hasAutoSubmitted.current) {
      hasAutoSubmitted.current = true;
      handleSubmit(true);
    }
  }, [remaining, handleSubmit]);

  // ── Current section questions ─────────────────────────────

  const currentQuestions =
    currentSection === 'networks' ? networkQuestions :
    currentSection === 'linux' ? linuxQuestions :
    writtenQuestions;

  const handleStart = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch { /* graceful fallback on mobile or unsupported browsers */ }
    setHasStarted(true);
  };

  if (!hasStarted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy-900/50 p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="type-sub mb-4 text-center text-white">Assessment Integrity & Rules</h2>
          <div className="mb-8 space-y-4 rounded-xl border border-amber-400/20 bg-amber-400/5 p-5 text-sm text-amber-400/90">
            <p><strong>Please remain on the assessment page while completing the assessment.</strong></p>
            <ul className="list-inside list-disc space-y-2 opacity-80">
              <li>Leaving the assessment window may be recorded as an integrity event.</li>
              <li>Fullscreen helps keep the assessment focused. If you leave fullscreen, the event may be recorded.</li>
              <li>Copying and pasting are restricted and recorded.</li>
              <li>These events are provided as context for human review.</li>
            </ul>
          </div>
          <button onClick={handleStart} className="btn-primary w-full py-4 text-lg">
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-navy-950">
      {integrityWarning && (
        <div className="fixed inset-x-0 top-16 z-[70] flex justify-center p-4">
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-3 text-sm font-medium text-amber-400 shadow-2xl backdrop-blur-md transition-all">
            {integrityWarning}
          </div>
        </div>
      )}

      {/* ── Fixed Header ──────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-[60] border-b border-white/10 bg-[#0B1020]/95 backdrop-blur-md">
        <div className="container-main flex h-16 items-center justify-between gap-4">
          {/* Candidate info */}
          <div className="flex min-w-0 flex-col">
            <span className="type-label hidden truncate font-medium text-white sm:block">
              {candidateName}
            </span>
            <span className="font-mono text-xs text-cyber-400">{candidateId}</span>
          </div>

          {/* Timer */}
          <div className="shrink-0">
            <TimerDisplay remaining={remaining} />
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={() => { setCurrentSection('final_review'); setCurrentQuestionIdx(0); }}
            disabled={submitting}
            className="btn-sm bg-cyber-500 text-white hover:bg-cyber-600 disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* Overall progress bar */}
        <div className="container-main pb-2 flex items-center justify-between gap-4">
          <div className="flex-1">
            <ProgressBar answered={totalAnswered} total={30} />
          </div>
          <div className="type-label shrink-0 font-mono text-white/50 hidden sm:block">
            {currentSection === 'networks' || currentSection === 'networks_review' ? 'Section A: Networks' : 
             currentSection === 'linux' || currentSection === 'linux_review' ? 'Section B: Linux' : 
             currentSection === 'written' ? 'Section C: Written' : 'Final Review'}
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────── */}
      <main className="container-main flex-1 pb-16 pt-36">
        {currentSection === 'final_review' ? (
          <FinalReview
            answers={answers}
            flagged={flagged}
            onReturnToSection={(s) => {
              setCurrentSection(s);
              setCurrentQuestionIdx(0);
            }}
            onSubmit={() => handleSubmit(false)}
            submitting={submitting}
          />
        ) : currentSection === 'networks_review' ? (
          <SectionReview
            sectionTitle="Section A — Computer Networks"
            questions={networkQuestions}
            answers={answers}
            flagged={flagged}
            onReturnToQuestion={(idx) => { setCurrentSection('networks'); setCurrentQuestionIdx(idx); }}
            onContinue={() => { setCurrentSection('linux'); setCurrentQuestionIdx(0); }}
            continueLabel="Continue to Linux"
          />
        ) : currentSection === 'linux_review' ? (
          <SectionReview
            sectionTitle="Section B — Linux Fundamentals"
            questions={linuxQuestions}
            answers={answers}
            flagged={flagged}
            onReturnToQuestion={(idx) => { setCurrentSection('linux'); setCurrentQuestionIdx(idx); }}
            onContinue={() => { setCurrentSection('written'); setCurrentQuestionIdx(0); }}
            continueLabel="Continue to Written Responses"
          />
        ) : (
          <>
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="type-sub text-white">
                {currentSection === 'networks' && 'Section A — Computer Networks'}
                {currentSection === 'linux' && 'Section B — Linux Fundamentals'}
                {currentSection === 'written' && 'Section C — Written Responses'}
              </h2>
              <p className="type-label mt-1 text-white/40">
                {currentSection === 'networks' && `Question ${currentQuestionIdx + 1} of 10`}
                {currentSection === 'linux' && `Question ${currentQuestionIdx + 1} of 10`}
                {currentSection === 'written' && (
                  <>10 open-ended questions · write in your own words · <span className="text-amber-400/80">AI tools are not permitted</span></>
                )}
              </p>
            </div>

            <div 
              className="flex flex-col gap-6 lg:flex-row lg:items-start"
              onCopy={currentSection !== 'written' ? handleCopy : undefined}
              onCut={currentSection !== 'written' ? handleCut : undefined}
              onContextMenu={handleContextMenu}
            >
              {/* Left Column: Questions */}
              <div className="flex-1 space-y-6">
                {currentSection === 'written' ? (
                  // Written Section rendering (vertically mapped)
                  <div className="flex flex-col gap-5">
                    {(currentQuestions as WrittenQuestion[]).map((q) => (
                      <WrittenCard
                        key={q.id}
                        q={q}
                        value={answers.written[q.id] ?? ''}
                        onChange={(v) => setWritten(q.id, v)}
                        onPasteAttempt={() => recordIntegrityEvent('paste_attempt')}
                      />
                    ))}
                  </div>
                ) : (
                  // MCQ Section rendering (single question)
                  <>
                    <MCQCard
                      key={currentQuestions[currentQuestionIdx].id}
                      q={currentQuestions[currentQuestionIdx] as MCQQuestion}
                      selected={answers.mcq[currentQuestions[currentQuestionIdx].id]}
                      flagged={flagged.has(currentQuestions[currentQuestionIdx].id)}
                      onSelect={(idx) => setMCQ(currentQuestions[currentQuestionIdx].id, idx)}
                      onFlag={() => toggleFlag(currentQuestions[currentQuestionIdx].id)}
                      onClear={() => clearMCQ(currentQuestions[currentQuestionIdx].id)}
                    />
                    
                    {/* Previous/Next Navigation */}
                    <div className="flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIdx === 0}
                        className="btn-secondary disabled:pointer-events-none disabled:opacity-0"
                      >
                        &larr; Previous
                      </button>
                      
                      {currentQuestionIdx === 9 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentSection(currentSection === 'networks' ? 'networks_review' : 'linux_review')}
                          className="btn-primary"
                        >
                          Review Section &rarr;
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCurrentQuestionIdx(prev => Math.min(9, prev + 1))}
                          className="btn-secondary"
                        >
                          Next &rarr;
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Right Column / Bottom Mobile: Quick Navigator */}
              <div className="lg:w-[340px] lg:shrink-0 sticky top-24">
                <QuickNavigator
                  questions={currentQuestions}
                  currentIdx={currentQuestionIdx}
                  answers={answers}
                  flagged={flagged}
                  onSelect={(idx) => {
                    if (currentSection === 'written') {
                      const el = document.getElementById(`written-${currentQuestions[idx].id}`);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                        el.focus();
                      }
                      setCurrentQuestionIdx(idx); // Used for active state in written navigator
                    } else {
                      setCurrentQuestionIdx(idx);
                    }
                  }}
                />

                {currentSection === 'written' && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => { setCurrentSection('final_review'); setCurrentQuestionIdx(0); }}
                      className="btn-primary w-full py-4 text-lg"
                    >
                      Final Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Submit error */}
        {submitError && (
          <p className="type-label mt-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-red-400" role="alert">
            {submitError}
          </p>
        )}
      </main>
    </div>
  );
}
