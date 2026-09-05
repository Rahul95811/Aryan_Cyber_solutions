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
  title: 'Assessment Rules & Integrity — Aryan Cyber Solutions',
  description: 'Pre-Assessment Briefing and Integrity Rules.',
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

  if (
    assessment.completionStatus === 'submitted' ||
    assessment.completionStatus === 'timeout'
  ) {
    redirect(`/training/submitted`);
  }

  if (assessment.integrityLockStatus === 'locked') {
    redirect(`/training/assessment`);
  }

  return (
    <div className="min-h-screen bg-navy-950 px-4 pt-24 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/training"
          className="type-label mb-8 inline-flex items-center gap-1.5 text-white/40 transition-colors hover:text-cyber-400"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Training
        </Link>

        {/* HEADER */}
        <header className="mb-12 text-center">
          <span className="type-label mb-4 inline-block font-bold uppercase tracking-widest text-cyber-500">
            PRE-ASSESSMENT BRIEFING
          </span>
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-5xl">ASSESSMENT RULES & INTEGRITY</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Please read the following information carefully before starting your 45-minute entry assessment.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 rounded-full border border-cyber-500/30 bg-cyber-500/10 px-4 py-2 text-sm font-bold tracking-widest text-cyber-400">
              45 MINUTES
            </div>
            <div className="flex items-center gap-2 rounded-full border border-cyber-500/30 bg-cyber-500/10 px-4 py-2 text-sm font-bold tracking-widest text-cyber-400">
              30 QUESTIONS
            </div>
            <div className="flex items-center gap-2 rounded-full border border-cyber-500/30 bg-cyber-500/10 px-4 py-2 text-sm font-bold tracking-widest text-cyber-400">
              3 SECTIONS
            </div>
            <div className="flex items-center gap-2 rounded-full border border-cyber-500/30 bg-cyber-500/10 px-4 py-2 text-sm font-bold tracking-widest text-cyber-400">
              ONE CONTINUOUS ATTEMPT
            </div>
          </div>
        </header>

        <div className="space-y-12">

          {/* ASSESSMENT STRUCTURE */}
          <section>
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-white">Assessment Overview</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-2 text-sm font-bold text-cyber-400">SECTION A</div>
                <h3 className="mb-4 text-lg font-bold text-white">Computer Networks</h3>
                <p className="text-sm text-white/60">10 multiple-choice questions</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-2 text-sm font-bold text-cyber-400">SECTION B</div>
                <h3 className="mb-4 text-lg font-bold text-white">Linux Fundamentals</h3>
                <p className="text-sm text-white/60">10 multiple-choice questions</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="mb-2 text-sm font-bold text-cyber-400">SECTION C</div>
                <h3 className="mb-4 text-lg font-bold text-white">Written Responses</h3>
                <p className="text-sm text-white/60">10 open-ended questions</p>
              </div>
            </div>
            <p className="mt-6 text-white/70">
              The assessment evaluates your technical fundamentals, reasoning, curiosity, communication, and willingness to learn.
            </p>
          </section>

          {/* TIME LIMIT */}
          <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="mb-4 text-xl font-bold uppercase tracking-widest text-amber-500">TIME LIMIT</h2>
                <ul className="list-inside list-disc space-y-2 text-amber-500/80">
                  <li>You have 45 minutes for the complete assessment.</li>
                  <li>The timer begins when you officially start the assessment.</li>
                  <li>The timer is continuous across all three sections and does not pause.</li>
                  <li>Leaving the page, integrity warnings, or fullscreen issues do not stop the timer.</li>
                  <li>Network problems do not extend the official deadline.</li>
                  <li>When time expires, the assessment is automatically submitted.</li>
                </ul>
                <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-500">Assessment Window: 4:00 PM – 12:00 AM (Midnight) IST</h3>
                  <p className="text-sm text-amber-500/80">
                    Assessment starts when you begin the assessment during the access window. Once started, you receive the full 45 minutes. The 12:00 AM (Midnight) cutoff applies only to new starts.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-amber-500/10 p-6 text-amber-500 border border-amber-500/20">
                <div className="text-5xl font-mono font-bold">45:00</div>
                <div className="mt-2 text-sm font-bold tracking-widest uppercase">TOTAL TIME</div>
              </div>
            </div>
          </section>

          {/* NAVIGATION */}
          <section>
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-white">How The Assessment Works</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-bold text-white">Navigation</h3>
                <p className="text-sm text-white/70">
                  MCQ sections display one question at a time. Use Next / Previous to move between them, or the Quick Access navigator to jump to specific questions. The Written section has its own navigator. You may leave questions unanswered and return to them before final submission.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-bold text-white">Flag & Clear Answer</h3>
                <p className="text-sm text-white/70">
                  You can flag a question for review and return to it later. You can also clear a selected MCQ answer, returning it to an unanswered state. Neither action pauses the timer.
                </p>
              </div>
            </div>
          </section>

          {/* INTEGRITY RULES */}
          <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-bold uppercase tracking-widest text-red-400">ASSESSMENT INTEGRITY</h2>
            <p className="mb-4 font-semibold text-white">
              This assessment must be completed independently using your own knowledge, reasoning, and experience.
            </p>
            <p className="mb-4 text-white/80">The following are <strong className="text-red-400">NOT permitted</strong>:</p>
            <ul className="mb-6 grid grid-cols-2 gap-2 text-sm text-white/70 sm:grid-cols-3">
              <li>• ChatGPT</li>
              <li>• Gemini</li>
              <li>• Claude</li>
              <li>• Copilot</li>
              <li>• Other AI assistants</li>
              <li>• Search engines</li>
              <li>• Online answer sites</li>
              <li>• Notes or textbooks</li>
              <li>• Outside assistance</li>
            </ul>
            <div className="rounded-xl bg-black/20 p-5 text-sm text-white/80 italic border border-white/5">
              &quot;We are assessing what you currently know, how you reason through unfamiliar problems, and how you communicate your own thoughts. Honest answers are more valuable than answers generated with outside assistance. Written responses must be written in your own words.&quot;
            </div>
          </section>

          {/* FULLSCREEN & FOCUS */}
          <section>
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-white">Fullscreen & Focus</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-bold text-cyber-400">Fullscreen Requirement</h3>
                <p className="text-sm text-white/70 mb-3">Exam Mode uses fullscreen where your browser supports it. Start Assessment will request fullscreen.</p>
                <ul className="list-inside list-disc text-sm text-white/70 space-y-1">
                  <li>Stay in fullscreen while completing the assessment.</li>
                  <li>If fullscreen is exited, the event may be recorded.</li>
                  <li>You may be given a short grace period to return to fullscreen.</li>
                  <li>Remaining outside fullscreen beyond the allowed grace period can consume an integrity strike.</li>
                  <li>Repeated violations can temporarily lock the assessment.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-bold text-cyber-400">Stay On The Assessment</h3>
                <p className="text-sm text-white/70 mb-3">Please remain on the assessment page throughout the examination.</p>
                <ul className="list-inside list-disc text-sm text-white/70 space-y-1">
                  <li>Switching tabs or applications may be detected.</li>
                  <li>A short grace period of approximately 5 seconds is provided for accidental focus changes.</li>
                  <li>Remaining away longer than the grace period may result in an integrity warning.</li>
                  <li>Three qualifying integrity violations may temporarily lock the assessment.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3-STRIKE SYSTEM */}
          <section>
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-white">3-Strike Integrity System</h2>
            <p className="mb-6 text-white/70">A strike may be caused by:</p>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-500">
                1. Remaining outside fullscreen beyond the 5-second grace period
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-500">
                2. Remaining away from the assessment/tab beyond the 5-second grace period
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-500">
                3. A detectable screenshot or screen-capture attempt
              </div>
            </div>

            <p className="mb-4 text-white/70 text-sm">
              The following are generally logged as integrity telemetry but do not by themselves consume a strike: copy attempts, cut attempts, paste attempts, print attempts, save attempts, navigation attempts, and short focus changes.
            </p>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="w-full sm:w-1/3 shrink-0 rounded bg-amber-500/20 px-3 py-1 font-mono text-sm font-bold text-amber-500 text-center">
                  STRIKE 1
                </div>
                <div className="text-sm text-white/80">
                  <strong className="text-amber-500">INTEGRITY WARNING — 1 OF 3.</strong> The activity has been recorded. You may continue, but please remain focused on the assessment and follow the exam rules. A 7-second warning overlay will temporarily block interaction. The timer continues.
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="w-full sm:w-1/3 shrink-0 rounded bg-amber-500/20 px-3 py-1 font-mono text-sm font-bold text-amber-500 text-center">
                  STRIKE 2
                </div>
                <div className="text-sm text-white/80">
                  <strong className="text-amber-500">INTEGRITY WARNING — 2 OF 3.</strong> One more qualifying integrity violation may temporarily lock the assessment. A 7-second warning overlay is displayed. The timer continues.
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center rounded-xl border border-red-500/20 bg-red-500/10 p-5">
                <div className="w-full sm:w-1/3 shrink-0 rounded bg-red-500/20 px-3 py-1 font-mono text-sm font-bold text-red-500 text-center">
                  STRIKE 3 (LOCK)
                </div>
                <div className="text-sm text-white/80">
                  <strong className="text-red-500">ASSESSMENT LOCK.</strong> Three qualifying integrity violations will temporarily lock the assessment. Answering, navigation, and submission are disabled. Existing answers are preserved. The assessment is locked pending review. Contact the training coordinator.
                </div>
              </div>
            </div>
          </section>

          {/* SCREENSHOTS & GRACE PERIOD */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-2 font-bold text-cyber-400">Screen Capture & Screenshots</h3>
              <p className="text-sm text-white/70 mb-3">Attempts to capture assessment content are restricted and monitored where the browser makes detection possible.</p>
              <ul className="list-inside list-disc text-sm text-white/70 space-y-1 mb-4">
                <li>Common detectable screenshot shortcuts may be recorded.</li>
                <li>Detected capture attempts can consume an integrity strike.</li>
                <li>The system cannot guarantee detection of every OS-level screenshot or external device.</li>
              </ul>
              <div className="rounded border border-white/10 bg-black/20 p-3 text-xs text-white/50">
                <strong>IMPORTANT:</strong> Browser-based assessments cannot completely prevent screenshots taken through external operating-system tools, another device, or hardware shortcuts. We use browser-level controls, detection, and audit logging to protect the assessment and provide integrity information for human review.
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between">
              <div>
                <h3 className="mb-2 font-bold text-cyber-400">5-Second Grace Period</h3>
                <p className="text-sm text-white/70 mb-6">For fullscreen exits or tab/window absence, the system provides a short buffer before a strike is issued.</p>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/20 font-bold text-green-500">0-5s</div>
                  <div className="text-white/80">Return within this window → No strike.</div>
                </div>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-500/20 font-bold text-amber-500">&gt;5s</div>
                  <div className="text-white/80">More than 5 seconds → Qualifying integrity violation (strike).</div>
                </div>
              </div>
              <p className="text-xs text-amber-500">The official 45-minute timer continues during the grace period.</p>
            </div>
          </section>

          {/* COPY PASTE & AUTOSAVE */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-2 font-bold text-white">Copy / Paste Restrictions</h3>
              <p className="text-sm text-white/70">
                Assessment content cannot be copied or easily extracted through standard browser interactions. External content cannot be pasted into written responses. These actions may be recorded as integrity telemetry.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-2 font-bold text-white">Your Answers Are Saved</h3>
              <p className="text-sm text-white/70">
                Where connectivity permits, your latest saved responses are synchronized to the server. Drafts are also stored locally. Refreshing should restore saved progress, but temporary connectivity loss does not intentionally erase saved work. The official timer continues regardless of connectivity.
              </p>
            </div>
          </section>

          {/* SUBMISSION & REVIEW */}
          <section>
            <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-white">Submission & Review</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-bold text-white">Submission</h3>
                <p className="text-sm text-white/70">
                  Before final submission, you can review sections, change answers, and review flagged items. When you submit, the assessment cannot be edited. When time reaches 00:00, the assessment automatically submits all answers currently available to the system.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-bold text-white">Written Response Review</h3>
                <p className="text-sm text-white/70">
                  The ten written responses are reviewed manually. We are interested in your own experiences, reasoning, technical understanding, curiosity, self-awareness, and learning mindset.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-2 font-bold text-white">Your Information</h3>
                <p className="text-sm text-white/70">
                  Information such as Full Name, Email, College, Roll Number, and Area of Interest is collected and used for assessment administration, candidate identification, evaluation, and communication.
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="mb-2 font-bold text-white">After You Submit</h3>
              <p className="text-sm text-white/70">
                Your Candidate ID remains your reference. The technical score is calculated, written responses go for manual review, and integrity information is reviewed where relevant. Admission decisions are made after review, and you will receive a follow-up communication within 7–10 business days.
              </p>
            </div>
          </section>

          {/* CHECKLIST & START */}
          <RulesClient candidateId={cid} candidateName={String(candidate.fullName)} />

        </div>
      </div>
    </div>
  );
}
