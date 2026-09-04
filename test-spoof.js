require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testSpoof() {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.dropDatabase();
  console.log('DB cleared.');

  // Register Candidate A
  let resA = await fetch('http://localhost:3001/api/training/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      fullName: 'Candidate A', 
      personalEmail: 'a@example.com', 
      collegeEmail: 'a@college.edu',
      collegeName: 'Test College',
      rollNumber: '1',
      phone: '+919876543210',
      yearOfStudy: '3rd Year'
    })
  });
  const cookieA = resA.headers.get('set-cookie').split(';')[0];
  const { candidateId: idA } = await resA.json();
  console.log('Registered Candidate A:', idA);

  // Register Candidate B
  let resB = await fetch('http://localhost:3001/api/training/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      fullName: 'Candidate B', 
      personalEmail: 'b@example.com', 
      collegeEmail: 'b@college.edu',
      collegeName: 'Test College',
      rollNumber: '2',
      phone: '+919876543211',
      yearOfStudy: '3rd Year'
    })
  });
  const cookieB = resB.headers.get('set-cookie').split(';')[0];
  const { candidateId: idB } = await resB.json();
  console.log('Registered Candidate B:', idB);

  // Start Assessment for B
  await fetch('http://localhost:3001/api/training/start', {
    method: 'POST',
    headers: { 'Cookie': cookieB }
  });
  console.log('Started Assessment for Candidate B');

  // Candidate A attacks Candidate B by calling /api/training/strike with B's candidateId in the header
  const crypto = require('crypto');
  console.log('Candidate A spoofing Candidate B header for Strike API...');
  const resSpoof = await fetch('http://localhost:3001/api/training/strike', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Cookie': cookieA, // Authenticated as A
      'x-candidate-id': idB // Spoofing B
    },
    body: JSON.stringify({ eventId: crypto.randomUUID(), eventType: 'absence', timestamp: new Date().toISOString() })
  });

  const Assessment = mongoose.connection.models.Assessment || mongoose.model('Assessment', new mongoose.Schema({}, { strict: false }));
  const docA = await Assessment.findOne({ candidateId: idA });
  const docB = await Assessment.findOne({ candidateId: idB });
  console.log('Candidate A Strikes:', docA?.integrityStrikeCount || 0);
  console.log('Candidate B Strikes:', docB?.integrityStrikeCount || 0);

  console.log('Spoof Response:', resSpoof.status, await resSpoof.json());
  process.exit(0);
}
testSpoof().catch(console.error);
