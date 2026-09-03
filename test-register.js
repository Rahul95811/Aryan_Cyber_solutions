import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectDB } from './src/lib/db.js';
import Counter from './src/lib/models/Counter.js';
import Candidate from './src/lib/models/Candidate.js';

async function test() {
  await connectDB();
  const cohortYear = 2026;
  const counterId = `candidateId_${cohortYear}`;
  let candidateId = '';
  let retries = 0;
  try {
    while (retries < 100) {
      const counter = await Counter.findOneAndUpdate(
        { id: counterId },
        { $inc: { seq: 1 } },
        { returnDocument: 'after', upsert: true }
      );
      console.log('counter:', counter);
      candidateId = `ACS-${cohortYear}-${String(counter.seq).padStart(6, '0')}`;
      const exists = await Candidate.exists({ candidateId });
      if (!exists) break;
      retries++;
    }
    console.log('Final candidateId:', candidateId);
  } catch (err) {
    console.error('Error during generation:', err);
  }
  process.exit(0);
}
test();
