import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { connectDB } from '@/lib/db';
import Assessment from '@/lib/models/Assessment';
import Candidate from '@/lib/models/Candidate';
import { scoreMCQ, MCQ_ANSWER_KEYS } from '@/lib/server-questions';
import { networkQuestions, linuxQuestions, writtenQuestions } from '@/lib/questions';
import { companyInfo } from '@/lib/data';

const submitSchema = z.object({
  mcqAnswers: z.record(z.string(), z.number().min(0).max(3)).optional(),
  writtenAnswers: z.record(z.string(), z.string().max(5000)).optional(),
  autoSubmit: z.boolean().optional().default(false),
  integrityEvents: z.array(z.object({
    type: z.enum(['tab_hidden', 'tab_visible', 'copy_attempt', 'cut_attempt', 'paste_attempt', 'fullscreen_exit', 'context_menu']),
    timestamp: z.string(),
    durationMs: z.number().optional(),
  })).optional(),
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const mcqQuestionMap = new Map(
  [...networkQuestions, ...linuxQuestions].map((q) => [q.id, q])
);
const writtenQuestionMap = new Map(writtenQuestions.map((q) => [q.id, q]));

export async function POST(request: NextRequest) {
  try {
    const candidateId = request.headers.get('x-candidate-id');
    if (!candidateId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = submitSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const { mcqAnswers, writtenAnswers, autoSubmit, integrityEvents } = result.data;

    await connectDB();

    const [candidate, assessment] = await Promise.all([
      Candidate.findOne({ candidateId }),
      Assessment.findOne({ candidateId }),
    ]);

    if (!candidate) return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
    if (!assessment) return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });

    // Prevent double submission
    if (
      assessment.completionStatus === 'submitted' ||
      assessment.completionStatus === 'timeout'
    ) {
      return NextResponse.json({ message: 'Assessment already submitted', candidateId }, { status: 409 });
    }

    if (!assessment.startedAt) {
      return NextResponse.json({ message: 'Assessment was never started' }, { status: 400 });
    }

    // Server-side time validation — 30-second grace for network latency
    const deadlineMs = assessment.startedAt.getTime() + 45 * 60 * 1000;
    const isTimeout = autoSubmit || Date.now() > deadlineMs + 30_000;

    // ── Server-side MCQ scoring ───────────────────────────────────────
    const { score, total, percentageRounded } = scoreMCQ(mcqAnswers ?? {});

    // ── Enrich MCQ answers: embed correct/incorrect + question text ───
    const mcqAnswerDocs = Object.entries(mcqAnswers ?? {}).map(
      ([questionId, selectedOption]) => {
        const q = mcqQuestionMap.get(questionId);
        const correctOption = MCQ_ANSWER_KEYS[questionId] ?? -1;
        const selected = selectedOption as number;
        const isCorrect = correctOption === selected;
        return {
          questionId,
          questionText:   q?.question ?? '',
          selectedOption: selected,
          selectedText:   q?.options[selected] ?? '(no answer)',
          correctOption,
          correctText:    q?.options[correctOption] ?? '',
          isCorrect,
          section:        questionId.startsWith('n') ? 'networks' : 'linux',
        };
      }
    );

    // Section-level breakdown
    const networksScore = mcqAnswerDocs.filter((a) => a.section === 'networks' && a.isCorrect).length;
    const linuxScore    = mcqAnswerDocs.filter((a) => a.section === 'linux'    && a.isCorrect).length;

    // ── Enrich written answers: embed question text ───────────────────
    const writtenAnswerDocs = Object.entries(writtenAnswers ?? {}).map(
      ([questionId, response]) => {
        const q = writtenQuestionMap.get(questionId);
        return {
          questionId,
          questionNumber: q?.questionNumber ?? 0,
          questionText:   q?.question ?? '',
          response:       (response as string) || '',
        };
      }
    ).sort((a, b) => a.questionNumber - b.questionNumber); // store in order

    const submittedAt = new Date();

    // ── Integrity aggregates ──────────────────────────────────────────
    const events = integrityEvents ?? [];
    const tab_switch_count = events.filter(e => e.type === 'tab_hidden').length;
    const total_away_time_ms = events
      .filter(e => e.type === 'tab_hidden' && e.durationMs)
      .reduce((sum, e) => sum + (e.durationMs || 0), 0);
    const copy_attempt_count = events.filter(e => e.type === 'copy_attempt').length;
    const paste_attempt_count = events.filter(e => e.type === 'paste_attempt').length;
    const fullscreen_exit_count = events.filter(e => e.type === 'fullscreen_exit').length;

    await Assessment.updateOne(
      { candidateId },
      {
        $set: {
          submittedAt,
          completionStatus:  isTimeout ? 'timeout' : 'submitted',
          mcqAnswers:        mcqAnswerDocs,
          mcqScore:          score,
          mcqScorePercent:   percentageRounded,
          networksScore,
          linuxScore,
          writtenAnswers:    writtenAnswerDocs,
          reviewStatus:      'pending',
          finalResult:       'pending',
          integrityEvents:   events,
          tab_switch_count,
          total_away_time_ms,
          copy_attempt_count,
          paste_attempt_count,
          fullscreen_exit_count,
          draftAnswers:      null, // clear draft on submission
        },
      }
    );

    // ── Confirmation emails ───────────────────────────────────────────
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromRaw = (process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev').replace(/^["']|["']$/g, '');
      const angleMatch = fromRaw.match(/<([^>]+)>/);
      const from = `Aryan Cyber Solutions <${angleMatch?.[1] ?? fromRaw}>`;
      const adminEmail = process.env.TRAINING_ADMIN_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? companyInfo.contactEmail;

      // ── Candidate: simple acknowledgement ──
      resend.emails.send({
        from,
        to: candidate.personalEmail,
        subject: `Assessment Submitted — ${candidateId}`,
        html: `
          <p>Hello ${escapeHtml(candidate.fullName)},</p>
          <p>Your entry assessment has been successfully submitted.</p>
          <p><strong>Candidate ID:</strong> <code>${escapeHtml(candidateId)}</code></p>
          <p>Our team will review your written responses manually. You will be contacted within <strong>7–10 business days</strong>.</p>
          <br /><p>Regards,<br />Aryan Cyber Solutions</p>
        `,
      }).catch(() => {});

      // ── Admin: full review email with correct/incorrect breakdown ──
      const mcqTableRows = mcqAnswerDocs
        .map((a, i) => `
          <tr style="background:${a.isCorrect ? '#0f2e1a' : '#2e0f0f'}">
            <td style="padding:6px 10px;font-family:monospace;color:#aaa">${String(i + 1).padStart(2, '0')}</td>
            <td style="padding:6px 10px;color:#ddd;font-size:13px">${escapeHtml(a.questionText.slice(0, 80))}…</td>
            <td style="padding:6px 10px;color:${a.isCorrect ? '#4ade80' : '#f87171'};font-weight:bold">${a.isCorrect ? '✓ Correct' : '✗ Wrong'}</td>
            <td style="padding:6px 10px;font-size:12px;color:#aaa">
              Selected: ${escapeHtml(a.selectedText.slice(0, 50))}<br/>
              ${!a.isCorrect ? `Correct: <span style="color:#4ade80">${escapeHtml(a.correctText.slice(0, 50))}</span>` : ''}
            </td>
          </tr>
        `)
        .join('');

      const writtenRows = writtenAnswerDocs
        .map((a) => `
          <div style="margin-bottom:24px;padding:16px;background:#111;border-radius:8px;border-left:3px solid #2563eb">
            <p style="font-size:12px;color:#6b7280;margin:0 0 4px">W${a.questionNumber}</p>
            <p style="font-size:14px;color:#d1d5db;margin:0 0 10px;font-weight:500">${escapeHtml(a.questionText)}</p>
            <p style="font-size:14px;color:#9ca3af;white-space:pre-wrap;margin:0;padding:10px;background:#1a1a2e;border-radius:4px">
              ${escapeHtml(a.response || '(no response provided)')}
            </p>
          </div>
        `)
        .join('');

      resend.emails.send({
        from,
        to: adminEmail,
        subject: `[ACS Review] ${candidateId} — MCQ: ${score}/${total} (Networks: ${networksScore}/10 · Linux: ${linuxScore}/10)`,
        html: `
          <div style="font-family:sans-serif;background:#0a0e1a;color:#e5e7eb;padding:24px;max-width:800px">
            <h1 style="font-size:20px;margin:0 0 4px">Assessment Submission</h1>
            <p style="color:#6b7280;margin:0 0 20px">${isTimeout ? '⏱ Auto-submitted (timeout)' : '✓ Manual submission'}</p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#111;border-radius:8px">
              <tr><td style="padding:8px 12px;color:#9ca3af">Candidate ID</td><td style="padding:8px 12px;font-family:monospace;color:#60a5fa">${escapeHtml(candidateId)}</td></tr>
              <tr style="background:#0f172a"><td style="padding:8px 12px;color:#9ca3af">Name</td><td style="padding:8px 12px">${escapeHtml(candidate.fullName)}</td></tr>
              <tr><td style="padding:8px 12px;color:#9ca3af">Email</td><td style="padding:8px 12px">${escapeHtml(candidate.personalEmail)}</td></tr>
              <tr style="background:#0f172a"><td style="padding:8px 12px;color:#9ca3af">College</td><td style="padding:8px 12px">${escapeHtml(candidate.collegeName)}</td></tr>
              <tr><td style="padding:8px 12px;color:#9ca3af">Roll No</td><td style="padding:8px 12px">${escapeHtml(candidate.rollNumber)}</td></tr>
              <tr style="background:#0f172a"><td style="padding:8px 12px;color:#9ca3af">Submitted</td><td style="padding:8px 12px">${submittedAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
            </table>

            <div style="background:#1e1e2d;padding:16px;border-radius:8px;border:1px solid ${events.length > 0 ? '#b91c1c' : '#059669'};margin-bottom:20px">
              <h2 style="font-size:16px;margin:0 0 12px;color:#fff">ASSESSMENT INTEGRITY</h2>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:13px;color:#d1d5db">
                <div>Tab switches: <strong>${tab_switch_count}</strong></div>
                <div>Away time: <strong>${Math.round(total_away_time_ms / 1000)}s</strong></div>
                <div>Copy attempts: <strong>${copy_attempt_count}</strong></div>
                <div>Paste attempts: <strong>${paste_attempt_count}</strong></div>
                <div>Fullscreen exits: <strong>${fullscreen_exit_count}</strong></div>
                <div>Total events: <strong>${events.length}</strong></div>
              </div>
              <div style="margin-top:12px;padding-top:12px;border-top:1px solid #334155;font-size:13px">
                Status: <strong>${events.length > 5 ? 'Review Recommended' : 'Normal'}</strong>
              </div>
            </div>

            <h2 style="font-size:16px;border-bottom:1px solid #1f2937;padding-bottom:8px">
              MCQ Score: <span style="color:#4ade80">${score} / ${total}</span>
              <span style="font-size:13px;font-weight:normal;color:#9ca3af;margin-left:12px">
                Networks: ${networksScore}/10 &nbsp;·&nbsp; Linux: ${linuxScore}/10
              </span>
            </h2>

            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:32px">
              <thead>
                <tr style="background:#1f2937;color:#9ca3af">
                  <th style="padding:6px 10px;text-align:left">#</th>
                  <th style="padding:6px 10px;text-align:left">Question</th>
                  <th style="padding:6px 10px;text-align:left">Result</th>
                  <th style="padding:6px 10px;text-align:left">Detail</th>
                </tr>
              </thead>
              <tbody>${mcqTableRows}</tbody>
            </table>

            <h2 style="font-size:16px;border-bottom:1px solid #1f2937;padding-bottom:8px">Written Responses (Manual Review)</h2>
            ${writtenRows}
          </div>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, candidateId, mcqScore: score, mcqTotal: total });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    console.error('[training/submit]', error);
    return NextResponse.json({ message: 'Submission failed. Please try again.' }, { status: 500 });
  }
}
