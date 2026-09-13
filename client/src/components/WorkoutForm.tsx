import type React from 'react';
import type { WorkoutFormState } from '../types/workout';

interface WorkoutFormProps {
  workoutForm: WorkoutFormState;
  onSubmit: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  error: string | null;
  loading: boolean;
  submitLabel?: string;
  loadingLabel?: string;
}

const WorkoutForm = ({
  workoutForm,
  onSubmit,
  onChange,
  error,
  loading,
  submitLabel,
  loadingLabel,
}: WorkoutFormProps) => {
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className='text-gray-200 bg-gray-700'>
      <h2>Workout Form</h2>
      {error && <p>{error}</p>}
      <form
        className='flex flex-col'
        onSubmit={handleSubmit}
      >
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          className='bg-white text-gray-900'
          name='name'
          value={workoutForm.name}
          onChange={onChange}
          required
        />
        <label htmlFor='difficulty'>Difficulty</label>
        <select
          className='bg-white text-gray-900'
          name='difficulty'
          value={workoutForm.difficulty}
          onChange={onChange}
        >
          <option value='easy'>Easy</option>
          <option value='medium'>Medium</option>
          <option value='hard'>Hard</option>
        </select>
        <button
          type='submit'
          disabled={loading}
        >
          {loading ? loadingLabel ?? 'Adding...' : submitLabel ?? 'Add'}
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;