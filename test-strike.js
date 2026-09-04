require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testStrikeAPI() {
  const MONGODB_URI = process.env.MONGODB_URI;
  await mongoose.connect(MONGODB_URI);
  await mongoose.connection.db.dropDatabase();
  console.log("DB cleared.");

  // Register Candidate
  let res = await fetch('http://localhost:3001/api/training/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Strike Test', email: 'strike@example.com', phone: '1234567890' })
  });
  const cookie = res.headers.get('set-cookie');
  const token = cookie.split(';')[0];
  const { candidateId } = await res.json();

  console.log("Registered:", candidateId);

  // Start
  res = await fetch('http://localhost:3001/api/training/start', {
    method: 'POST',
    headers: { 'Cookie': token }
  });
  console.log("Start:", await res.json());

  // 1. Strike 1
  const crypto = require('crypto');
  const eventId1 = crypto.randomUUID();
  console.log("Firing Strike 1...");
  res = await fetch('http://localhost:3001/api/training/strike', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': token },
    body: JSON.stringify({ eventId: eventId1, eventType: 'absence', timestamp: new Date().toISOString() })
  });
  let data = await res.json();
  console.log("Strike 1 Response:", data);
  if (data.integrityStrikeCount !== 1) throw new Error("Expected strike 1");

  // 2. Replay Protection
  console.log("Firing Strike 1 REPLAY...");
  res = await fetch('http://localhost:3001/api/training/strike', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': token },
    body: JSON.stringify({ eventId: eventId1, eventType: 'absence', timestamp: new Date().toISOString() })
  });
  data = await res.json();
  console.log("Replay Response:", data);
  if (data.integrityStrikeCount !== 1) throw new Error("Expected replay to be ignored and remain at strike 1");

  // 3. Concurrent Strikes (Strike 2 and 3 at the exact same time)
  console.log("Firing Concurrent Strikes (2 & 3)...");
  const eventId2 = crypto.randomUUID();
  const eventId3 = crypto.randomUUID();
  const p1 = fetch('http://localhost:3001/api/training/strike', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': token },
    body: JSON.stringify({ eventId: eventId2, eventType: 'absence', timestamp: new Date().toISOString() })
  });
  const p2 = fetch('http://localhost:3001/api/training/strike', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': token },
    body: JSON.stringify({ eventId: eventId3, eventType: 'absence', timestamp: new Date().toISOString() })
  });

  const [res2, res3] = await Promise.all([p1, p2]);
  const data2 = await res2.json();
  const data3 = await res3.json();
  console.log("Concurrent Response 1:", data2);
  console.log("Concurrent Response 2:", data3);

  if (data2.integrityStrikeCount < 2 || data3.integrityStrikeCount < 2) throw new Error("Expected at least strike 2 in both");
  
  // To ensure the final state in DB is actually 3 and locked, let's fetch draft
  res = await fetch('http://localhost:3001/api/training/draft', {
    headers: { 'Cookie': token }
  });
  data = await res.json();
  console.log("Final DB State:", data);
  if (data.integrityStrikeCount !== 3) throw new Error("Expected exactly 3 strikes");
  if (data.integrityLockStatus !== 'locked') throw new Error("Expected locked status");

  console.log("SUCCESS! All tests passed.");
  process.exit(0);
}

testStrikeAPI().catch(err => {
  console.error(err);
  process.exit(1);
});
