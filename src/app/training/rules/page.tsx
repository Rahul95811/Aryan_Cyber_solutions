import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { connectDB } from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import Assessment from '@/lib/models/Assessment';
import RulesClient from '@/components/training/RulesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Assessment Rules — Training · Aryan Cyber Solutions',
  description: 'Read the assessment rules and integrity declaration before beginning your entry assessment.',
};

export default async function RulesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('acs_session')?.value;
  if (!token) redirect('/training/register');

  const session = await verifySessionToken(token);
  if (!session || !session.candidateId) redirect('/training/register');

  const cid = session.candidateId;

  await connectDB();

  const candidate = await Candidate.findOne({ candidateId: cid }).lean();
  if (!candidate) redirect('/training/register');

  const assessment = await Assessment.findOne({ candidateId: cid }).lean();
  if (!assessment) redirect('/training/register');

  // If already submitted, go straight to the submitted page
  if (
    assessment.completionStatus === 'submitted' ||
    assessment.completionStatus === 'timeout'
  ) {
    redirect(`/training/submitted`);
  }

  const rules = [
    { title: 'Duration', detail: '45 minutes total — the timer starts when you click "Start Assessment" and cannot be paused.' },
    { title: 'Questions', detail: '30 questions across 3 sections: 10 Computer Networks MCQs, 10 Linux MCQs, and 10 written-response questions.' },
    { title: 'Navigation', detail: 'You may move freely between sections and revisit your answers at any time during the assessment.' },
    { title: 'Flagging', detail: 'You can flag any question for review and return to it before submitting.' },
    { title: 'Auto-Submit', detail: 'When the timer reaches zero, your assessment is submitted automatically with all answers recorded up to that point.' },
    { title: 'Browser Refresh', detail: 'Your answers are saved periodically. If you accidentally refresh, your progress will be restored — but the timer will continue running.' },
    { title: 'Submission', detail: 'Once submitted (manually or automatically), no further changes are permitted.' },
    { title: 'Results', detail: 'MCQ answers are scored automatically. Written responses are reviewed manually. You will be notified within 7–10 business days.' },
  ];

  return (
    <div className="page-top section-padding bg-navy-950">
      <div className="container-main">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <Link
            href="/training"
            className="type-label mb-8 inline-flex items-center gap-1.5 text-white/40 transition-colors hover:text-cyber-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Training
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="type-label mb-3 inline-block font-semibold uppercase tracking-widest text-cyber-400">
              Step 2 of 3 — Read Rules Before Proceeding
            </span>
            <h1 className="type-section mb-3 text-white">Assessment Rules</h1>
            <p className="type-body text-white/55">
              Please read all rules carefully before starting. The timer begins immediately when you click
              <strong className="text-white"> Start Assessment</strong>.
            </p>
          </div>

          {/* Rules list */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <ul className="flex flex-col divide-y divide-white/8">
              {rules.map((r) => (
                <li key={r.title} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <svg className="mt-1 h-4 w-4 shrink-0 text-cyber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="type-label font-semibold text-white">{r.title}</p>
                    <p className="type-body mt-0.5 text-white/55">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrity Declaration + Start Button */}
          <RulesClient candidateId={cid} candidateName={String(candidate.fullName)} />
        </div>
      </div>
    </div>
  );
}
