import { useState } from 'react';
import WorkoutSummary from '../components/WorkoutSummary';
import WorkoutList from '../components/WorkoutList';
import type { Workout } from '../types/workout';
import WorkoutForm from '../components/WorkoutForm';

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

  function addWorkout(workout: Workout): void {
    setWorkouts((prev) => [...prev, workout]);
  }

  return (
    <div>
      <h1>Welcome Back</h1>
      <p>Today's workout</p>
      <WorkoutSummary workouts={workouts} />
      <WorkoutList workouts={workouts} />
      <WorkoutForm onAddWorkout={addWorkout} />
    </div>
  );
};

export default Dashboard;
