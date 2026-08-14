import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import type { Workout, Difficulty } from '../types/workout';

type WorkoutFormProps = {
  onAddWorkout: (workout: Workout) => void;
};

type WorkoutFormState = {
  name: string;
  difficulty: Difficulty;
};

const WorkoutForm = ({ onAddWorkout }: WorkoutFormProps) => {
  const [newWorkout, setNewWorkout] = useState<WorkoutFormState>({
    name: '',
    difficulty: 'easy',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
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
      difficulty: newWorkout.difficulty,
    };

    onAddWorkout(workout);
    setNewWorkout({
      name: '',
      difficulty: 'easy',
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
      <select
        name='difficulty'
        value={newWorkout.difficulty}
        onChange={handleChange}
      >
        <option value='easy'>Easy</option>
        <option value='medium'>Medium</option>
        <option value='hard'>Hard</option>
      </select>
      <button type='submit'>Add</button>
    </form>
  );
};

export default WorkoutForm;
