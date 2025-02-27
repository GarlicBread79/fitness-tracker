// src/components/Progress.js

import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function groupWorkoutsByDate(workouts = []) {
  const dateSet = new Set();
  workouts.forEach((w) => {
    if (w.date) {
      const dateStr = new Date(w.date).toLocaleDateString();
      dateSet.add(dateStr);
    }
  });

  const uniqueDates = Array.from(dateSet).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const runningData = [];
  const liftingData = [];
  const yogaData = [];

  uniqueDates.forEach((dateLabel) => {
    let runSum = 0;
    let liftSum = 0;
    let yogaSum = 0;

    workouts.forEach((w) => {
      const wDate = w.date ? new Date(w.date).toLocaleDateString() : null;
      if (wDate === dateLabel) {
        if (w.activity === 'Running') {
          runSum += Number(w.calories || 0);
        } else if (w.activity === 'Weight Lifting') {
          liftSum += Number(w.calories || 0);
        } else if (w.activity === 'Yoga') {
          yogaSum += Number(w.calories || 0);
        }
      }
    });

    runningData.push(runSum);
    liftingData.push(liftSum);
    yogaData.push(yogaSum);
  });

  return { uniqueDates, runningData, liftingData, yogaData };
}

function Progress({ activeProfile, workouts = [] }) {
  if (!activeProfile) {
    return (
      <div className="container mt-4">
        <h2>Your Progress</h2>
        <p>No active profile selected. Please go to Profiles to choose one.</p>
      </div>
    );
  }

  // Filter for active profile
  const filteredWorkouts = workouts.filter(
    (w) => w.profileId === activeProfile._id
  );

  if (filteredWorkouts.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Your Progress</h2>
        <p>No workouts logged yet for {activeProfile.name}.</p>
      </div>
    );
  }

  // Group by date, sum cals
  const { uniqueDates, runningData, liftingData, yogaData } =
    groupWorkoutsByDate(filteredWorkouts);

  const chartData = {
    labels: uniqueDates,
    datasets: [
      {
        label: 'Running',
        data: runningData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
      {
        label: 'Weight Lifting',
        data: liftingData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
      },
      {
        label: 'Yoga',
        data: yogaData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: { weight: 'bold', size: 14 },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calories Burned',
          font: { weight: 'bold', size: 14 },
        },
      },
    },
  };

  return (
    <div className="container mt-4">
      <h2>Your Progress (Profile: {activeProfile.name})</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card p-3">
            <Line data={chartData} options={options} />
          </div>
        </div>
        <div className="col-md-6">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity</th>
                <th>Duration</th>
                <th>Calories</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.map((w, idx) => (
                <tr key={idx}>
                  <td>
                    {w.date
                      ? new Date(w.date).toLocaleDateString()
                      : `Workout #${idx + 1}`}
                  </td>
                  <td>{w.activity}</td>
                  <td>{w.duration || ''}</td>
                  <td>{w.calories || ''}</td>
                  <td>{w.activity === 'Weight Lifting' ? w.sets : ''}</td>
                  <td>{w.activity === 'Weight Lifting' ? w.reps : ''}</td>
                  <td>{w.activity === 'Weight Lifting' ? w.weight : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Progress;
