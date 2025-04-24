// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  language: String,
  theme: String,
  // Add any other user fields you might need
});

module.exports = mongoose.model('User', userSchema);

