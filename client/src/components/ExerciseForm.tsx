import type React from 'react';
import type { ExerciseFormState } from '../types/exercise';


interface ExerciseFormProps {
  exerciseForm: ExerciseFormState;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error: string | null;
  loading: boolean;
}

const ExerciseForm = ({
  exerciseForm,
  onSubmit,
  onChange,
  error,
  loading
}: ExerciseFormProps) => {


  //handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className='text-gray-200 bg-gray-700'>
      <h2>Exercise Form</h2>
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
          value={exerciseForm.name}
          onChange={onChange}
          required
        />
        <label htmlFor='description'>Description</label>
        <textarea
          className='bg-white text-gray-900'
          name='description'
          value={exerciseForm.description}
          onChange={onChange}
        />
        <button type='submit' disabled={loading}> {loading ? 'Adding...' : 'Add'}</button>
      </form>
    </div>
  );
};

export default ExerciseForm;
