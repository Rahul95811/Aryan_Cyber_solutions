require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.db.dropDatabase();
  console.log('DB cleared.');

  console.log('\\n--- Test S: Phone Normalization Bypass ---');
  // Attempt to register with a 10-digit number without country code
  let resPhone = await fetch('http://localhost:3001/api/training/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      fullName: 'Phone Bypass', 
      personalEmail: 'phone1@example.com', 
      collegeEmail: 'phone1@college.edu',
      collegeName: 'Test College',
      rollNumber: '1',
      phone: '9876543210',
      yearOfStudy: '3rd Year'
    })
  });
  console.log('Phone Test (no +91):', await resPhone.json());

  // Attempt to register with an invalid short number
  let resPhoneBad = await fetch('http://localhost:3001/api/training/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      fullName: 'Phone Bypass', 
      personalEmail: 'phone2@example.com', 
      collegeEmail: 'phone2@college.edu',
      collegeName: 'Test College',
      rollNumber: '2',
      phone: '12345',
      yearOfStudy: '3rd Year'
    })
  });
  console.log('Phone Test (bad length):', await resPhoneBad.json());

  console.log('\\n--- Test T: Contact Spam ---');
  // Fire 5 contact requests quickly
  for (let i = 1; i <= 5; i++) {
    let formData = new URLSearchParams();
    formData.append('type', 'contact');
    formData.append('fullName', 'Spammer');
    formData.append('email', 'spam@example.com');
    formData.append('phone', '1234567890');
    formData.append('company', 'Spam Inc');
    formData.append('subject', 'Spam');
    formData.append('message', 'Spam spam spam spam spam spam');
    
    let resContact = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    console.log(`Contact Request ${i}: ${resContact.status}`);
  }

  process.exit(0);
}
runTests().catch(console.error);
