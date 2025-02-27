// index.js

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// 1) Import your existing user/workout routes
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

// 2) Import your new profile routes
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev')); // Logs each request
app.use(cors());        // Enable CORS so front-end can call the back-end

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    // Optional test snippet: create one example workout
    const Workout = require('./models/Workout');
    Workout.create({
      activity: 'running',
      duration: 30,
      calories: 300,
    })
      .then((doc) => {
        console.log('Test workout created:', doc);
      })
      .catch((err) => {
        console.error('Error creating workout:', err);
      });
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Basic route to verify the server
app.get('/', (req, res) => {
  res.send('Fitness Tracker API with Mongoose, Morgan, and separate routes!');
});

// Wire up user routes at /api/users
app.use('/api/users', userRoutes);

// Wire up workout routes at /api/workouts
app.use('/api/workouts', workoutRoutes);

// 3) Wire up profile routes at /api/profiles
app.use('/api/profiles', profileRoutes);

// Global error-handling middleware (must come after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
