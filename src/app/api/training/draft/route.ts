import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Assessment from '@/lib/models/Assessment';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const draftSchema = z.object({
  answers: z.object({
    mcq: z.record(z.string(), z.number().min(0).max(3)).optional(),
    written: z.record(z.string(), z.string().max(5000)).optional(),
  }),
});

// POST — save a draft of in-progress answers
export async function POST(request: NextRequest) {
  try {
    const candidateId = request.headers.get('x-candidate-id');
    if (!candidateId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 60 requests per minute per candidate
    const { success } = await rateLimit(`draft_${candidateId}`, 60, 60);
    if (!success) {
      return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const result = draftSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    await connectDB();

    const assessment = await Assessment.findOne({ candidateId });
    if (!assessment) {
      return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
    }

    if (assessment.completionStatus === 'submitted' || assessment.completionStatus === 'timeout') {
      return NextResponse.json({ message: 'Assessment already completed' }, { status: 409 });
    }

    if (assessment.integrityLockStatus === 'locked') {
      return NextResponse.json({ message: 'Assessment is locked' }, { status: 403 });
    }

    const { answers } = result.data;

    const updateFields: any = {
      draftAnswers: {
        mcq: answers.mcq ?? {},
        written: answers.written ?? {},
        savedAt: new Date().toISOString(),
      },
    };

    await Assessment.updateOne(
      { candidateId },
      { $set: updateFields }
    );

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error('[training/draft POST]', error);
    return NextResponse.json({ message: 'Failed to save draft' }, { status: 500 });
  }
}

// GET — retrieve the latest server-side draft on page reload
export async function GET(request: NextRequest) {
  try {
    const candidateId = request.headers.get('x-candidate-id');
    if (!candidateId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const assessment = await Assessment.findOne(
      { candidateId },
      { draftAnswers: 1, startedAt: 1, completionStatus: 1, integrityStrikeCount: 1, integrityLockStatus: 1 }
    );

    if (!assessment) {
      return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json({
      draftAnswers: assessment.draftAnswers ?? null,
      startedAt: assessment.startedAt?.toISOString() ?? null,
      completionStatus: assessment.completionStatus,
      integrityStrikeCount: assessment.integrityStrikeCount ?? 0,
      integrityLockStatus: assessment.integrityLockStatus ?? 'none',
    });
  } catch (error) {
    console.error('[training/draft GET]', error);
    return NextResponse.json({ message: 'Failed to fetch draft' }, { status: 500 });
  }
}
