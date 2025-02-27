// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfileList from './components/ProfileList';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import WorkoutLog from './components/WorkoutLog';
import Progress from './components/Progress';
import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // 1) Store all profiles
  const [profiles, setProfiles] = useState([]);

  // 2) Track the currently active profile (null if none)
  const [activeProfile, setActiveProfile] = useState(null);

  // 3) Also store workouts
  const [workouts, setWorkouts] = useState([]);

  // Fetch profiles on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/profiles')
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
        // If you want to auto-select the first profile ONLY if none is selected:
        // if (!activeProfile && data.length > 0) {
        //   setActiveProfile(data[0]);
        // }
      })
      .catch((err) => console.error('Error fetching profiles:', err));
  }, []);

  // Fetch workouts on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/workouts')
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
      })
      .catch((err) => console.error('Error fetching workouts:', err));
  }, []);

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">FitTrack</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/workout-log" className="nav-link">Log Workout</Link>
              </li>
              <li className="nav-item">
                <Link to="/progress" className="nav-link">Progress</Link>
              </li>
              <li className="nav-item">
                <Link to="/profiles" className="nav-link">Profiles</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          {/* Show all profiles + pick active */}
          <Route
            path="/profiles"
            element={
              <ProfileList
                profiles={profiles}
                setProfiles={setProfiles}
                activeProfile={activeProfile}
                setActiveProfile={setActiveProfile}
              />
            }
          />

          {/* Create or edit a single profile */}
          <Route
            path="/profile/:profileId"
            element={
              <Profile
                profiles={profiles}
                setProfiles={setProfiles}
                activeProfile={activeProfile}
                setActiveProfile={setActiveProfile}
              />
            }
          />

          {/* Dashboard: pass workouts + activeProfile so it can filter or display them */}
          <Route
            path="/"
            element={
              <Dashboard
                workouts={workouts}
                activeProfile={activeProfile}
              />
            }
          />

          {/* WorkoutLog: pass workouts + setWorkouts + activeProfile for profileId */}
          <Route
            path="/workout-log"
            element={
              <WorkoutLog
                workouts={workouts}
                setWorkouts={setWorkouts}
                activeProfile={activeProfile}
              />
            }
          />

          {/* Progress: now also pass workouts so it can filter them */}
          <Route
            path="/progress"
            element={
              <Progress
                activeProfile={activeProfile}
                workouts={workouts}  // <-- ADDED
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
