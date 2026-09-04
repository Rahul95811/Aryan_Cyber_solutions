require('dotenv').config({ path: '.env.local' });
process.env.JWT_SECRET = 'temporary-test-secret-12345';
const mongoose = require('mongoose');

async function runRegression() {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.dropDatabase();
  console.log('DB cleared.');

  // 1. Registration
  let resReg = await fetch('http://localhost:3001/api/training/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      fullName: 'Valid User', 
      personalEmail: 'valid@example.com', 
      collegeEmail: 'valid@college.edu',
      collegeName: 'Test College',
      rollNumber: '1234',
      phone: '9876543210',
      yearOfStudy: '3rd Year'
    })
  });
  console.log('Registration Status:', resReg.status);
  const cookie = resReg.headers.get('set-cookie').split(';')[0];
  const { candidateId } = await resReg.json();

  // 2. Start Assessment
  let resStart = await fetch('http://localhost:3001/api/training/start', {
    method: 'POST',
    headers: { 'Cookie': cookie }
  });
  console.log('Start Assessment Status:', resStart.status);

  // 3. Save Draft
  let resDraft = await fetch('http://localhost:3001/api/training/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({
      answers: { mcq: { n01: 2 }, written: { w01: 'Hello' } }
    })
  });
  console.log('Save Draft Status:', resDraft.status);

  // 4. Strike (x1)
  const crypto = require('crypto');
  let resStrike = await fetch('http://localhost:3001/api/training/strike', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({ eventId: crypto.randomUUID(), eventType: 'tab_hidden', timestamp: new Date().toISOString() })
  });
  console.log('Strike Status:', resStrike.status, await resStrike.json());

  // 5. Submit Assessment (excluding integrityEvents payload)
  let resSubmit = await fetch('http://localhost:3001/api/training/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': cookie },
    body: JSON.stringify({
      mcqAnswers: { n01: 2 },
      writtenAnswers: { w01: 'Hello' },
      autoSubmit: false
    })
  });
  console.log('Submit Status:', resSubmit.status, await resSubmit.json());

  // Verify DB state
  const Assessment = mongoose.connection.models.Assessment || mongoose.model('Assessment', new mongoose.Schema({}, { strict: false }));
  const doc = await Assessment.findOne({ candidateId });
  console.log('Final DB Status:', doc.completionStatus);
  console.log('Final DB Strike Count:', doc.integrityStrikeCount);
  console.log('Final DB Integrity Events Length:', doc.integrityEvents.length);
  
  process.exit(0);
}
runRegression().catch(console.error);
