// models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  activity: {
    type: String,
    required: true,
    enum: ['Running', 'Weight Lifting', 'Yoga', 'Other'],
  },
  duration: {
    type: Number,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  sets: {
    type: Number,
    default: 0,
  },
  reps: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // Link to the profile that created this workout
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', 
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Workout', workoutSchema);
