import { connectDB } from './db';
import RateLimit from './models/RateLimit';

export async function rateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; current: number }> {
  try {
    await connectDB();
    const now = new Date();

    const existing = await RateLimit.findOne({ key: identifier });

    if (existing) {
      if (existing.expiresAt && existing.expiresAt <= now) {
        // Window expired — reset count and expiration
        existing.count = 1;
        existing.expiresAt = new Date(now.getTime() + windowSeconds * 1000);
        await existing.save();
        return { success: true, current: 1 };
      }

      const updated = await RateLimit.findOneAndUpdate(
        { key: identifier },
        { $inc: { count: 1 } },
        { returnDocument: 'after' }
      );
      const currentCount = updated ? updated.count : existing.count + 1;
      return {
        success: currentCount <= limit,
        current: currentCount,
      };
    }

    await RateLimit.create({
      key: identifier,
      count: 1,
      expiresAt: new Date(now.getTime() + windowSeconds * 1000),
    });

    return { success: true, current: 1 };
  } catch (err) {
    console.error('[rateLimit error]', err);
    // Fail open in case of rate-limiting infrastructure issue so users are not blocked
    return { success: true, current: 1 };
  }
}

