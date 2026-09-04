import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { connectDB } from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import Assessment from '@/lib/models/Assessment';
import AssessmentEngine from '@/components/training/AssessmentEngine';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Entry Assessment — Aryan Cyber Solutions',
  description: 'Complete your cybersecurity training entry assessment.',
  robots: { index: false, follow: false }, // Do not index the assessment page
};

export default async function AssessmentPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('acs_session')?.value;
  if (!token) redirect('/training/register');

  const session = await verifySessionToken(token);
  if (!session || !session.candidateId) redirect('/training/register');

  const cid = session.candidateId;

  await connectDB();

  const [candidate, assessment] = await Promise.all([
    Candidate.findOne({ candidateId: cid }).lean(),
    Assessment.findOne({ candidateId: cid }).lean(),
  ]);

  if (!candidate) redirect('/training/register');
  if (!assessment) redirect('/training/register');

  // Already submitted — go to confirmation page
  if (
    assessment.completionStatus === 'submitted' ||
    assessment.completionStatus === 'timeout'
  ) {
    redirect(`/training/submitted`);
  }

  // Assessment not started yet — send back to rules
  if (!assessment.startedAt) {
    redirect(`/training/rules`);
  }

  const startedAt = new Date(assessment.startedAt).getTime();
  const deadlineTimestamp = startedAt + 45 * 60 * 1000;

  // Server-side check: time already expired — auto-complete on next submit
  // We still render the engine so it can fire the auto-submit immediately on load
  const now = Date.now();
  const alreadyExpired = now >= deadlineTimestamp;

  // Restore draft answers from server
  const draft = assessment.draftAnswers as { mcq?: Record<string, number>; written?: Record<string, string> } | null;
  const initialDraft = draft
    ? { mcq: draft.mcq ?? {}, written: draft.written ?? {} }
    : null;

  if (assessment.integrityLockStatus === 'locked') {
    return (
      <div className="flex min-h-screen flex-col bg-navy-950 relative">
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-6 backdrop-blur-xl">
          <div className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-red-500">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">ASSESSMENT TEMPORARILY LOCKED</h2>
            <p className="mb-8 text-red-200">
              Multiple assessment integrity violations have been detected.
              Your assessment has been temporarily locked and the activity has been recorded.
              Please contact the training coordinator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AssessmentEngine
      candidateId={cid}
      candidateName={String(candidate.fullName)}
      deadlineTimestamp={alreadyExpired ? now - 1000 : deadlineTimestamp}
      initialDraft={initialDraft}
      initialStrikeCount={assessment.integrityStrikeCount ?? 0}
      initialLockStatus={false}
    />
  );
}
