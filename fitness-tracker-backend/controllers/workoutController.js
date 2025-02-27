// controllers/workoutController.js
const Workout = require('../models/Workout');

// Create a new workout
exports.createWorkout = async (req, res, next) => {
  try {
    const newWorkout = await Workout.create(req.body);
    res.status(201).json(newWorkout);
  } catch (error) {
    next(error);
  }
};

// Get all workouts
exports.getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({});
    res.json(workouts);
  } catch (error) {
    next(error);
  }
};

// DELETE a workout by ID
exports.deleteWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const deleted = await Workout.findByIdAndDelete(workoutId);
    if (!deleted) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// UPDATE (edit) a workout by ID
exports.updateWorkout = async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const updatedData = req.body;

    const updated = await Workout.findByIdAndUpdate(workoutId, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
