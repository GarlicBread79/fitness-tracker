// routes/workoutRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  createWorkout,
  getWorkouts,
  deleteWorkout,
  updateWorkout,
} = require('../controllers/workoutController');

const router = express.Router();

// POST /api/workouts -> create a new workout
router.post(
  '/',
  [
    body('activity').notEmpty().withMessage('Activity is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
    body('calories').isInt({ min: 1 }).withMessage('Calories must be at least 1'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return createWorkout(req, res, next);
  }
);

// GET /api/workouts -> fetch all workouts
router.get('/', getWorkouts);

// DELETE /api/workouts/:id -> delete a workout by ID
router.delete('/:id', deleteWorkout);

// PUT /api/workouts/:id -> update (edit) a workout by ID
router.put('/:id', updateWorkout);

module.exports = router;
