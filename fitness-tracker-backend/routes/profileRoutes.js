// routes/profileRoutes.js
const express = require('express');
const {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile
} = require('../controllers/profileController');

const router = express.Router();

// POST /api/profiles -> create a new profile
router.post('/', createProfile);

// GET /api/profiles -> fetch all profiles
router.get('/', getProfiles);

// GET /api/profiles/:id -> fetch one profile
router.get('/:id', getProfileById);

// PUT /api/profiles/:id -> update a profile
router.put('/:id', updateProfile);

// DELETE /api/profiles/:id -> delete a profile
router.delete('/:id', deleteProfile);

module.exports = router;
