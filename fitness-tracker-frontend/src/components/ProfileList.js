// src/components/ProfileList.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileList({
  profiles,
  setProfiles,
  activeProfile,
  setActiveProfile
}) {
  const navigate = useNavigate();

  const handleSelectProfile = (profile) => {
    setActiveProfile(profile);
  };

  const handleDeleteProfile = async (profileId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profiles/${profileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete profile');
      }

      // remove from local state
      setProfiles((prev) => prev.filter((p) => p._id !== profileId));

      // if the deleted profile was active, clear active
      if (activeProfile && activeProfile._id === profileId) {
        setActiveProfile(null);
      }

      alert('Profile deleted successfully!');
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Profiles</h2>
      {profiles.length === 0 ? (
        <p>No profiles found. Create one below!</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Fitness Goal</th>
              <th>Status</th>
              <th style={{ width: '220px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>{p.fitnessGoal || 'Not set'}</td>
                <td>
                  {activeProfile && activeProfile._id === p._id
                    ? <span className="badge bg-success">Active</span>
                    : <span className="badge bg-secondary">Inactive</span>
                  }
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleSelectProfile(p)}
                  >
                    Select
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => navigate(`/profile/${p._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProfile(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="btn btn-success"
        onClick={() => navigate('/profile/new')}
      >
        Create New Profile
      </button>
    </div>
  );
}

export default ProfileList;
