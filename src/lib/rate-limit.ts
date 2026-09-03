import { connectDB } from './db';
import RateLimit from './models/RateLimit';

export async function rateLimit(identifier: string, limit: number, windowSeconds: number): Promise<{ success: boolean; current: number }> {
  await connectDB();
  
  const now = new Date();
  
  // Use findOneAndUpdate for atomic increment
  const result = await RateLimit.findOneAndUpdate(
    { key: identifier },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date(now.getTime() + windowSeconds * 1000) }
    },
    { upsert: true, returnDocument: 'after' }
  );

  const currentCount = result ? result.count : 1;

  return {
    success: currentCount <= limit,
    current: currentCount
  };
}
