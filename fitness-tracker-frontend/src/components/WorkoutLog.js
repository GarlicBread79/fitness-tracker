// src/components/WorkoutLog.js

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function parseLocalDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-');
  return new Date(+year, +month - 1, +day, 12, 0, 0);
}

function WorkoutLog({ workouts, setWorkouts, activeProfile }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      activity: 'Running',
      duration: '',
      calories: '',
      sets: '',
      reps: '',
      weight: '',
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // The function we call when the user types in an Edit row
  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const watchActivity = watch('activity');

  // If there's no active profile, just show a message
  if (!activeProfile) {
    return (
      <div className="container mt-4">
        <h2>Log Your Workout</h2>
        <p>No active profile selected. Please go to Profiles to choose one.</p>
      </div>
    );
  }

  // CREATE a new workout
  const onSubmit = async (data) => {
    try {
      data.date = selectedDate.toISOString();
      data.profileId = activeProfile._id;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workout');
      }
      const createdWorkout = await response.json();

      setWorkouts((prev) => [...prev, createdWorkout]);
      alert('Workout logged successfully!');
      reset();
      setSelectedDate(new Date());
    } catch (error) {
      console.error('Error creating workout:', error);
      alert(error.message);
    }
  };

  // DELETE a workout
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/workouts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete workout');
      }
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert(error.message);
    }
  };

  // Begin editing
  const startEdit = (workout) => {
    setEditId(workout._id);
    setEditForm({
      activity: workout.activity || 'Running',
      duration: workout.duration || '',
      calories: workout.calories || '',
      sets: workout.sets || '',
      reps: workout.reps || '',
      weight: workout.weight || '',
      date: workout.date
        ? new Date(workout.date).toISOString().slice(0, 10)
        : '',
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  // SAVE the updated workout
  const saveEdit = async (id) => {
    try {
      const dateObj = parseLocalDate(editForm.date);
      const isoDate = dateObj ? dateObj.toISOString() : null;

      const updatedData = {
        ...editForm,
        date: isoDate,
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/workouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update workout');
      }
      const updatedWorkout = await response.json();

      setWorkouts((prev) =>
        prev.map((w) => (w._id === id ? updatedWorkout : w))
      );
      setEditId(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating workout:', error);
      alert(error.message);
    }
  };

  // Filter workouts so we only see this active profile's
  const displayedWorkouts = workouts.filter(
    (w) => w.profileId === activeProfile._id
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-3">
        Log Your Workout (Profile: {activeProfile.name})
      </h2>

      {/* CREATE new workout form */}
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3 mb-4">
        {/* Date Picker */}
        <div className="col-md-4">
          <label className="form-label">Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </div>

        {/* Activity */}
        <div className="col-md-4">
          <label className="form-label">Activity:</label>
          <select className="form-select" {...register('activity')}>
            <option value="Running">Running</option>
            <option value="Weight Lifting">Weight Lifting</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>

        {/* Duration */}
        <div className="col-md-4">
          <label className="form-label">Duration (minutes):</label>
          <input
            type="number"
            className="form-control"
            {...register('duration', {
              required: 'Duration is required',
              min: { value: 1, message: 'Must be at least 1 minute' },
            })}
          />
          {errors.duration && (
            <p className="text-danger">{errors.duration.message}</p>
          )}
        </div>

        {/* Calories */}
        <div className="col-md-4">
          <label className="form-label">Calories Burned:</label>
          <input
            type="number"
            className="form-control"
            {...register('calories', {
              required: 'Calories is required',
              min: { value: 1, message: 'Must be at least 1 calorie' },
            })}
          />
          {errors.calories && (
            <p className="text-danger">{errors.calories.message}</p>
          )}
        </div>

        {/* Conditionally show sets/reps/weight if Weight Lifting */}
        {watchActivity === 'Weight Lifting' && (
          <>
            <div className="col-md-4">
              <label className="form-label">Sets:</label>
              <input
                type="number"
                className="form-control"
                {...register('sets', {
                  required: 'Sets is required for lifting',
                  min: { value: 1, message: 'Must be at least 1 set' },
                })}
              />
              {errors.sets && (
                <p className="text-danger">{errors.sets.message}</p>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Reps:</label>
              <input
                type="number"
                className="form-control"
                {...register('reps', {
                  required: 'Reps is required for lifting',
                  min: { value: 1, message: 'Must be at least 1 rep' },
                })}
              />
              {errors.reps && (
                <p className="text-danger">{errors.reps.message}</p>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Weight (lbs):</label>
              <input
                type="number"
                className="form-control"
                {...register('weight', {
                  required: 'Weight is required for lifting',
                  min: { value: 1, message: 'Must be at least 1 lb' },
                })}
              />
              {errors.weight && (
                <p className="text-danger">{errors.weight.message}</p>
              )}
            </div>
          </>
        )}

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Log Workout
          </button>
        </div>
      </form>

      <h3>Logged Workouts</h3>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Duration</th>
            <th>Calories</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedWorkouts.map((w) => {
            if (w._id === editId) {
              // Edit mode row
              return (
                <tr key={w._id}>
                  <td>
                    <select
                      name="activity"
                      className="form-select"
                      value={editForm.activity || ''}
                      onChange={handleEditChange}
                    >
                      <option value="Running">Running</option>
                      <option value="Weight Lifting">Weight Lifting</option>
                      <option value="Yoga">Yoga</option>
                    </select>
                  </td>
                  <td>
                    <input
                      name="duration"
                      type="number"
                      className="form-control"
                      value={editForm.duration || ''}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="calories"
                      type="number"
                      className="form-control"
                      value={editForm.calories || ''}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="sets"
                      type="number"
                      className="form-control"
                      value={editForm.sets || ''}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="reps"
                      type="number"
                      className="form-control"
                      value={editForm.reps || ''}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="weight"
                      type="number"
                      className="form-control"
                      value={editForm.weight || ''}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      name="date"
                      type="date"
                      className="form-control"
                      value={editForm.date || ''}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => saveEdit(w._id)}
                    >
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            } else {
              // Normal row
              return (
                <tr key={w._id}>
                  <td>{w.activity}</td>
                  <td>{w.duration}</td>
                  <td>{w.calories}</td>
                  <td>{w.sets}</td>
                  <td>{w.reps}</td>
                  <td>{w.weight}</td>
                  <td>
                    {w.date ? new Date(w.date).toLocaleDateString() : ''}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => startEdit(w)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(w._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

export default WorkoutLog;
