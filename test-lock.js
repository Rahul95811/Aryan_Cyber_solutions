const http = require('http');

async function testLockFlow() {
  console.log("Starting test-lock.js...");
  const baseUrl = 'http://localhost:3001';
  
  // 1. Register candidate
  console.log("1. Registering candidate...");
  const regRes = await fetch(`${baseUrl}/api/training/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test Candidate',
      personalEmail: `test${Date.now()}@example.com`,
      collegeEmail: `test${Date.now()}@college.edu`,
      collegeName: 'Test College',
      rollNumber: '123456',
      phone: '+919876543210',
      yearOfStudy: 'Final Year',
      areaOfInterest: 'Security'
    })
  });
  
  const regData = await regRes.json();
  if (!regRes.ok) {
    console.error("Registration failed:", regData);
    process.exit(1);
  }
  const cid = regData.candidateId;
  const rawCookie = regRes.headers.get('set-cookie');
  const cookie = rawCookie ? rawCookie.split(';')[0] : '';
  console.log("Registered candidate:", cid, "Cookie:", cookie);

  // 2. Start Assessment
  console.log("2. Starting assessment...");
  const startRes = await fetch(`${baseUrl}/api/training/start`, {
    method: 'POST',
    headers: { Cookie: cookie }
  });
  const startData = await startRes.json();
  console.log("Start response:", startRes.status, startData);

  // 3. Draft Assessment
  console.log("3. Testing draft before lock...");
  const draftRes = await fetch(`${baseUrl}/api/training/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ answers: { mcq: {}, written: {} } })
  });
  console.log("Draft response:", draftRes.status, await draftRes.json());

  // 4. Trigger Lock
  console.log("4. Triggering lock...");
  const lockRes = await fetch(`${baseUrl}/api/training/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      reason: 'Testing lock bypass fix',
      strikeCount: 3,
      integrityEvents: [{ type: 'fullscreen_exit', timestamp: new Date().toISOString() }]
    })
  });
  console.log("Lock response:", lockRes.status, await lockRes.json());

  // 5. Try Start again
  console.log("5. Testing start after lock...");
  const startAfterLock = await fetch(`${baseUrl}/api/training/start`, {
    method: 'POST',
    headers: { Cookie: cookie }
  });
  console.log("Start after lock response:", startAfterLock.status, await startAfterLock.json());

  // 6. Try Draft again
  console.log("6. Testing draft after lock...");
  const draftAfterLock = await fetch(`${baseUrl}/api/training/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ answers: { mcq: {}, written: {} } })
  });
  console.log("Draft after lock response:", draftAfterLock.status, await draftAfterLock.json());

  // 7. Try Submit again
  console.log("7. Testing submit after lock...");
  const submitAfterLock = await fetch(`${baseUrl}/api/training/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ answers: { mcq: {}, written: {} } })
  });
  console.log("Submit after lock response:", submitAfterLock.status, await submitAfterLock.json());
}

testLockFlow().catch(console.error);
