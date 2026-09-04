import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { connectDB } from '@/lib/db';
import Candidate from '@/lib/models/Candidate';
import Assessment from '@/lib/models/Assessment';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Assessment Submitted — Training · Aryan Cyber Solutions',
  description: 'Your entry assessment has been submitted successfully.',
};

export default async function SubmittedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('acs_session')?.value;
  
  let cid = '';
  let candidateName = '';
  let submittedAt = '';
  let isTimeout = false;

  if (token) {
    const session = await verifySessionToken(token);
    if (session && session.candidateId) {
      cid = session.candidateId;
      try {
        await connectDB();
        const [candidate, assessment] = await Promise.all([
          Candidate.findOne({ candidateId: cid }).lean(),
          Assessment.findOne({ candidateId: cid }, { submittedAt: 1, completionStatus: 1 }).lean(),
        ]);
        if (assessment?.integrityLockStatus === 'locked') {
          redirect(`/training/assessment`);
        }
        if (candidate) candidateName = String(candidate.fullName);
        if (assessment?.submittedAt) {
          submittedAt = new Date(assessment.submittedAt).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'short',
          });
          isTimeout = assessment.completionStatus === 'timeout';
        }
      } catch { /* non-critical — show page regardless */ }
    }
  }

  return (
    <div className="page-top section-padding flex min-h-screen flex-col items-center justify-center bg-navy-950">
      <div className="container-main">
        <div className="mx-auto max-w-xl text-center">
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">
            <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="type-section mb-2 text-white">Assessment Submitted</h1>

          {candidateName && (
            <p className="type-body mb-1 text-white/60">
              Well done, <span className="text-white">{candidateName}</span>.
            </p>
          )}

          {isTimeout && (
            <p className="type-label mt-2 rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-amber-400">
              Your assessment was automatically submitted when the time expired.
            </p>
          )}

          {/* Candidate ID */}
          {cid && (
            <div className="my-6 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5">
              <p className="type-label mb-1 text-white/40">Your Candidate ID</p>
              <p className="font-mono text-2xl font-bold tracking-widest text-cyber-400">{cid}</p>
              <p className="type-label mt-1 text-white/30">Save this ID for reference</p>
            </div>
          )}

          {submittedAt && (
            <p className="type-label mb-6 text-white/35">Submitted: {submittedAt}</p>
          )}

          {/* What happens next */}
          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left">
            <h2 className="type-label mb-4 font-semibold text-white">What Happens Next</h2>
            <ul className="flex flex-col gap-3">
              {[
                { icon: '✓', text: 'Your MCQ answers have been scored automatically.' },
                { icon: '👁', text: 'Your written responses will be reviewed manually by our team.' },
                { icon: '📧', text: 'A confirmation email has been sent to your registered personal email.' },
                { icon: '🕐', text: 'You will be contacted with an admission decision within 7–10 business days.' },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 text-base">{item.icon}</span>
                  <span className="type-body text-white/60">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <Link href="/internships" className="btn-secondary">
              View Internship Programmes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
