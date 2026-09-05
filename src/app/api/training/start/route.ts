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

    // Enforce Assessment Window: 4:00 PM - 12:00 AM (Midnight) IST
    const now = new Date();
    const istHourStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(now);
    const currentIstHour = parseInt(istHourStr, 10) % 24;

    const accessStartHour = parseInt(process.env.ASSESSMENT_START_HOUR || '16', 10);
    const accessEndHour = parseInt(process.env.ASSESSMENT_END_HOUR || '24', 10);

    const formatHour = (h: number): string => {
      if (h === 24 || h === 0) return '12:00 AM (Midnight)';
      if (h === 12) return '12:00 PM';
      if (h > 12) return `${h - 12}:00 PM`;
      return `${h}:00 AM`;
    };

    const isWindowActive = accessEndHour === 24
      ? currentIstHour >= accessStartHour
      : currentIstHour >= accessStartHour && currentIstHour < accessEndHour;

    if (!isWindowActive && process.env.ASSESSMENT_BYPASS_WINDOW !== 'true') {
      if (accessEndHour === 24 && currentIstHour < 4) {
        return NextResponse.json(
          { message: `Assessment window closed at 12:00 AM (Midnight) IST. The window is active between ${formatHour(accessStartHour)} and 12:00 AM (Midnight) IST.` },
          { status: 403 }
        );
      }
      if (currentIstHour < accessStartHour) {
        return NextResponse.json(
          { message: `Assessment has not started yet. The window opens at ${formatHour(accessStartHour)} IST (Assessment Window: ${formatHour(accessStartHour)} – ${formatHour(accessEndHour)} IST).` },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { message: `Assessment window closed at ${formatHour(accessEndHour)} IST.` },
        { status: 403 }
      );
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
