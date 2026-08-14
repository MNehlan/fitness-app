import { useState } from 'react';
import WorkoutSummary from '../components/WorkoutSummary';
import WorkoutList from '../components/WorkoutList';
import type { Workout, Difficulty } from '../types/workout';
import WorkoutForm from '../components/WorkoutForm';

const Dashboard = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Push Day',
      difficulty: 'easy',
    },
    {
      id: '2',
      name: 'Leg Day',
      difficulty: 'medium',
    },
  ]);

  function addWorkout(workout: Workout) {
    setWorkouts((prev) => [...prev, workout]);
  }

  function removeWorkout(id: string) {
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
  }

  function updateWorkout(
    id: string,
    newName: string,
    newDifficulty: Difficulty,
  ) {
    setWorkouts((prev) =>
      prev.map((workout) =>
        workout.id === id
          ? { ...workout, name: newName, difficulty: newDifficulty }
          : workout,
      ),
    );
  }

  return (
    <div>
      <h1>Welcome Back</h1>
      <p>Today's workout</p>
      <WorkoutSummary workouts={workouts} />
      <WorkoutList
        workouts={workouts}
        onDelete={removeWorkout}
        onUpdate={updateWorkout}
      />
      <WorkoutForm onAddWorkout={addWorkout} />
    </div>
  );
};

export default Dashboard;
