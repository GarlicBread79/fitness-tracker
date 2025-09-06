// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 * POST /api/users/register
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, fitnessGoal } = req.body;

    // 1. Check if email already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user in DB
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      fitnessGoal
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login a user
 * POST /api/users/login
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // 3. Create a JWT token
    // In production, store secret key in an ENV variable
    const token = jwt.sign({ id: user._id }, 'YOUR_SECRET_KEY', {
      expiresIn: '1d' // token valid for 1 day
    });

    res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get the current user's profile
 * GET /api/users/profile
 * Protected by authMiddleware
 */
exports.getUserProfile = async (req, res) => {
  try {
    // userId set by authMiddleware
    const user = await User.findById(req.userId).select('-password'); // exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update the current user's profile
 * PUT /api/users/profile
 * Protected by authMiddleware
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, fitnessGoal } = req.body;

    // find the user by req.userId
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // update fields if provided
    if (name !== undefined) user.name = name;
    if (fitnessGoal !== undefined) user.fitnessGoal = fitnessGoal;

    // if you allow changing email/password, handle carefully
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
