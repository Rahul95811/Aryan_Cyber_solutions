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

  return (
    <AssessmentEngine
      candidateId={cid}
      candidateName={String(candidate.fullName)}
      deadlineTimestamp={alreadyExpired ? now - 1000 : deadlineTimestamp}
      initialDraft={initialDraft}
    />
  );
}
