// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Profile({ profiles, setProfiles, activeProfile, setActiveProfile }) {
  const { profileId } = useParams();
  const navigate = useNavigate();

  const isNew = profileId === 'new';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fitnessGoal: ''
  });

  useEffect(() => {
    if (!isNew) {
      const existing = profiles.find((p) => p._id === profileId);
      if (existing) {
        setFormData({
          name: existing.name,
          email: existing.email,
          fitnessGoal: existing.fitnessGoal || ''
        });
      }
    }
  }, [isNew, profileId, profiles]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNew) {
      // POST /api/profiles
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Error creating profile');
        return;
      }
      const newProfile = await response.json();
      setProfiles((prev) => [...prev, newProfile]);
      setActiveProfile(newProfile);
      alert('Profile created!');
    } else {
      // PUT /api/profiles/:profileId
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || 'Error updating profile');
        return;
      }
      const updated = await response.json();
      setProfiles((prev) =>
        prev.map((p) => (p._id === profileId ? updated : p))
      );
      if (activeProfile && activeProfile._id === profileId) {
        setActiveProfile(updated);
      }
      alert('Profile updated!');
    }

    navigate('/profiles');
  };

  // Optionally add a delete button if you want to delete from here as well

  return (
    <div className="container mt-4">
      <h2>{isNew ? 'Create Profile' : 'Edit Profile'}</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fitness Goal</label>
          <select
            name="fitnessGoal"
            className="form-select"
            value={formData.fitnessGoal}
            onChange={handleChange}
          >
            <option value="">--None--</option>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Muscle Gain">Muscle Gain</option>
            <option value="Endurance">Endurance</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {isNew ? 'Create' : 'Save'}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/profiles')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
