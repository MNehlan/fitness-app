import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import type { Workout } from '../types/workout';

type WorkoutFormProps = {
  onAddWorkout: (workout: Workout) => void;
};

const WorkoutForm = ({ onAddWorkout }: WorkoutFormProps) => {
  const [newWorkout, setNewWorkout] = useState({
    name: '',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setNewWorkout((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!newWorkout.name.trim()) {
      return;
    }

    const workout: Workout = {
      id: crypto.randomUUID(),
      name: newWorkout.name,
    };

    onAddWorkout(workout);
    setNewWorkout({
      name: '',
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        name='name'
        value={newWorkout.name}
        onChange={handleChange}
      />
      <button type='submit'>Add</button>
    </form>
  );
};

export default WorkoutForm;
