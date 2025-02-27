// src/components/Dashboard.js
import React from 'react';

function Dashboard({ workouts, activeProfile }) {
  if (!activeProfile) {
    return (
      <div className="container mt-4">
        <h2>Dashboard</h2>
        <p>No active profile selected. Please go to Profiles to choose one.</p>
      </div>
    );
  }

  // Filter by active profile
  const filteredWorkouts = workouts.filter(
    (w) => w.profileId === activeProfile._id
  );

  const totalWorkouts = filteredWorkouts.length;

  const totalCalories = filteredWorkouts.reduce((sum, w) => {
    return sum + Number(w.calories || 0);
  }, 0);

  return (
    <div className="container mt-4">
      <h2>Welcome, {activeProfile.name}!</h2>
      <p className="text-muted">
        Your fitness goal: {activeProfile.fitnessGoal || 'Not set'}
      </p>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Workouts Logged</h5>
              <p className="card-text fs-3">{totalWorkouts}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Calories Burned</h5>
              <p className="card-text fs-3">{totalCalories}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
