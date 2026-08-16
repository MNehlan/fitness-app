import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import type { Workout, Difficulty } from '../types/workout';

type WorkoutFormProps = {
  onAddWorkout: (workout: Workout) => void;
};

type WorkoutFormState = {
  name: string;
  difficulty: Difficulty;
};

function isDifficulty(value: string): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

const WorkoutForm = ({ onAddWorkout }: WorkoutFormProps) => {
  const [newWorkout, setNewWorkout] = useState<WorkoutFormState>({
    name: '',
    difficulty: 'easy',
  });

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setNewWorkout((prev) => ({ ...prev, name: e.target.value }));
  }

  function handleDifficultyChange(e: ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;

    if (!isDifficulty(value)) {
      return;
    }

    setNewWorkout((prev) => ({ ...prev, difficulty: value }));
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
        onChange={handleNameChange}
      />
      <select
        name='difficulty'
        value={newWorkout.difficulty}
        onChange={handleDifficultyChange}
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
