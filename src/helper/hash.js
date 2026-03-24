// hash.js
// Helper functions for password hashing & comparison

const bcrypt = require('bcryptjs'); // Library for hashing passwords

// Hash plain password before saving to DB
async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);  // Generate salt
  return bcrypt.hash(plain, salt);        // Return hashed password
}

// Compare plain password with hashed one in DB
async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);   // Return true/false
}

module.exports = { hashPassword, comparePassword };
// Helper functions for password hashing & comparison