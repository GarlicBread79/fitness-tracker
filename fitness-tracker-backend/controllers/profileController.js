// controllers/profileController.js
const Profile = require('../models/Profile');

/**
 * Create a new profile
 * POST /api/profiles
 */
exports.createProfile = async (req, res) => {
  try {
    const { name, email, fitnessGoal } = req.body;
    // You can add validation or check if email already exists, etc.

    const newProfile = await Profile.create({ name, email, fitnessGoal });
    return res.status(201).json(newProfile);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Get all profiles
 * GET /api/profiles
 */
exports.getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({});
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single profile by ID
 * GET /api/profiles/:id
 */
exports.getProfileById = async (req, res) => {
  try {
    const profileId = req.params.id;
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update a profile
 * PUT /api/profiles/:id
 */
exports.updateProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const { name, email, fitnessGoal } = req.body;

    const updated = await Profile.findByIdAndUpdate(
      profileId,
      { name, email, fitnessGoal },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete a profile
 * DELETE /api/profiles/:id
 */
exports.deleteProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const deleted = await Profile.findByIdAndDelete(profileId);
    if (!deleted) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
