import { useState } from 'react';
import WorkoutSummary from '../components/WorkoutSummary';
import WorkoutList from '../components/WorkoutList';
import type { Workout } from '../types/workout';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Push Day',
    },
    {
      id: '2',
      name: 'Leg Day',
    },
  ]);

  return (
    <div>
      <h1>Welcome Back</h1>
      <p>Today's workout</p>
      <WorkoutSummary workouts={workouts} />
      <WorkoutList workouts={workouts} />
    </div>
  );
};

export default Dashboard;
