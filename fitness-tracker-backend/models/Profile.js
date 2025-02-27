// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fitnessGoal: { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);
