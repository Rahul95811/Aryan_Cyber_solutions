import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const Candidate = mongoose.connection.collection('candidates');
  const Counter = mongoose.connection.collection('counters');
  
  const count = await Candidate.countDocuments({ cohortYear: 2026 });
  console.log(`Current candidates count for 2026: ${count}`);
  
  await Counter.updateOne(
    { id: 'candidateId_2026' },
    { $set: { seq: count } },
    { upsert: true }
  );
  
  console.log(`Counter updated to ${count}`);
  process.exit(0);
}

fix();
