import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Assessment from '@/lib/models/Assessment';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const strikeSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.enum([
    'tab_hidden', 'tab_visible', 'copy_attempt', 'cut_attempt', 'paste_attempt', 
    'fullscreen_exit', 'context_menu', 'print_attempt', 'save_attempt', 
    'navigation_attempt', 'drag_attempt', 'screen_capture_attempt', 
    'screenshot_shortcut_attempt', 'integrity_strike', 'fullscreen_grace_expired',
    'absence', 'absence_returned', 'grace_period_used'
  ]),
  timestamp: z.string(),
  durationMs: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const candidateId = request.headers.get('x-candidate-id');
    if (!candidateId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const result = strikeSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const { eventId, eventType, timestamp, durationMs } = result.data;

    // Rate limit: 20 strikes per minute per candidate
    const { success } = await rateLimit(`strike_${candidateId}`, 20, 60);
    if (!success) {
      return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
    }

    await connectDB();

    // 1. Atomically increment strike count and push the event.
    // The query filter ensures we don't process the same eventId twice (Replay Protection).
    let assessment = await Assessment.findOneAndUpdate(
      { 
        candidateId,
        completionStatus: 'in_progress',
        integrityLockStatus: { $ne: 'locked' },
        "integrityEvents.eventId": { $ne: eventId }
      },
      {
        $inc: { integrityStrikeCount: 1 },
        $push: { 
          integrityEvents: { 
            $each: [{ 
              eventId, 
              type: eventType, 
              timestamp, 
              durationMs 
            }],
            $slice: -500
          } 
        }
      },
      { new: true } // Return the updated document
    );

    // If assessment is null, it means either:
    // a) It doesn't exist
    // b) It's already completed or locked
    // c) This exact eventId was already processed
    if (!assessment) {
      // Fallback: check why it failed to find it.
      const existing = await Assessment.findOne({ candidateId });
      if (!existing) {
        return NextResponse.json({ message: 'Assessment not found' }, { status: 404 });
      }
      if (existing.completionStatus !== 'in_progress') {
        return NextResponse.json({ message: 'Assessment already completed' }, { status: 409 });
      }
      if (existing.integrityLockStatus === 'locked') {
        return NextResponse.json({ 
          success: true, 
          integrityStrikeCount: existing.integrityStrikeCount,
          integrityLockStatus: 'locked' 
        });
      }
      // If it exists, is in progress, and not locked, it must be a replay of the same eventId.
      return NextResponse.json({ 
        success: true, 
        integrityStrikeCount: existing.integrityStrikeCount,
        integrityLockStatus: existing.integrityLockStatus 
      });
    }

    // 2. Third-Strike Lock Evaluation
    if ((assessment.integrityStrikeCount ?? 0) >= 3) {
      assessment = await Assessment.findOneAndUpdate(
        { candidateId },
        { 
          $set: { 
            integrityLockStatus: 'locked', 
            integrityLockedAt: new Date(), 
            integrityLockedReason: '3 integrity strikes exceeded' 
          } 
        },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      integrityStrikeCount: assessment!.integrityStrikeCount ?? 0,
      integrityLockStatus: assessment!.integrityLockStatus,
    });
  } catch (error) {
    console.error('[training/strike POST]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
