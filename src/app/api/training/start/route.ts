import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Assessment from '@/lib/models/Assessment';
import Candidate from '@/lib/models/Candidate';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const startSchema = z.object({}); // start expects no specific body, candidateId comes from auth

export async function POST(request: NextRequest) {
  try {
    const candidateId = request.headers.get('x-candidate-id');

    if (!candidateId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit: 5 requests per minute per candidate
    const { success } = await rateLimit(`start_${candidateId}`, 5, 60);
    if (!success) {
      return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
    }

    // Try parsing the body, but it's empty so it's mostly a sanity check
    const body = await request.json().catch(() => ({}));
    startSchema.parse(body);

    await connectDB();

    const candidate = await Candidate.findOne({ candidateId });
    if (!candidate) {
      return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
    }

    const assessment = await Assessment.findOne({ candidateId });
    if (!assessment) {
      return NextResponse.json({ message: 'Assessment record not found' }, { status: 404 });
    }

    if (assessment.integrityLockStatus === 'locked') {
      return NextResponse.json({ message: 'Assessment is temporarily locked' }, { status: 403 });
    }

    // If already started, return the existing startedAt so timer remains correct
    if (assessment.startedAt) {
      const deadlineTimestamp = assessment.startedAt.getTime() + 45 * 60 * 1000;
      return NextResponse.json({
        alreadyStarted: true,
        startedAt: assessment.startedAt.toISOString(),
        deadlineTimestamp,
      });
    }

    // If already submitted, reject
    if (assessment.completionStatus === 'submitted' || assessment.completionStatus === 'timeout') {
      return NextResponse.json({ message: 'Assessment already submitted' }, { status: 409 });
    }

    // Enforce Assessment Window: 10:00 AM - 11:00 AM IST
    const now = new Date();
    const istTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const currentIstHour = parseInt(istTimeStr.split(':')[0], 10) % 24;

    const accessStartHour = parseInt(process.env.ASSESSMENT_START_HOUR || '10', 10);
    const accessEndHour = parseInt(process.env.ASSESSMENT_END_HOUR || '11', 10);

    if (currentIstHour < accessStartHour) {
      return NextResponse.json({ message: `Assessment has not started yet. The window opens at ${accessStartHour}:00 IST.` }, { status: 403 });
    }
    
    if (currentIstHour >= accessEndHour) {
      return NextResponse.json({ message: `Assessment window closed at ${accessEndHour}:00 IST.` }, { status: 403 });
    }

    // Record start time server-side — this is the source of truth for the timer
    const startedAt = now;
    await Assessment.updateOne(
      { candidateId },
      { $set: { startedAt, completionStatus: 'in_progress' } }
    );

    const deadlineTimestamp = startedAt.getTime() + 45 * 60 * 1000;

    return NextResponse.json({
      alreadyStarted: false,
      startedAt: startedAt.toISOString(),
      deadlineTimestamp,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }
    console.error('[training/start]', error);
    return NextResponse.json({ message: 'Failed to start assessment' }, { status: 500 });
  }
}
