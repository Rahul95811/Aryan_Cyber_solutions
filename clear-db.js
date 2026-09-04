require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function clearDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    process.exit(1);
  }
  
  console.log("Connecting to DB...");
  await mongoose.connect(uri);
  console.log("Connected. Dropping collections...");
  
  try {
    await mongoose.connection.db.dropDatabase();
    console.log("Database dropped successfully.");
  } catch (err) {
    console.error("Error dropping database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

clearDB().catch(console.error);
