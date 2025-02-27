// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fitnessGoal: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // adds createdAt, updatedAt
});

module.exports = mongoose.model('User', userSchema);
