require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/users');
const { userRegister } = require('./controllers/auth');
const connectDB = require('./config/db');

async function run() {
  try {
    await connectDB();
    
    // Clean up any previous test user
    await User.deleteOne({ email: 'test.register@example.com' });
    
    console.log("Starting registration process...");
    
    // Override the mailer locally just for this test so we don't spam
    const { sendVerificationCode } = require('./helpers/email');
    
    const result = await userRegister({
      firstName: 'Test',
      lastName: 'Registration',
      email: 'test.register@example.com',
      password: 'password123'
    });
    
    console.log("Success! Output:", result.message);
    console.log("Tokens generated:", !!result.tokens.accessToken);
    
    // Clean up
    await User.deleteOne({ email: 'test.register@example.com' });
    process.exit(0);
  } catch (err) {
    console.error("Test failed with error:", err.message);
    process.exit(1);
  }
}

run();
