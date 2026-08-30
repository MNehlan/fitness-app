import type React from 'react';
import type { ExerciseFormState } from '../types/exercise';


interface ExerciseFormProps {
  exerciseForm: ExerciseFormState;
  setExerciseForm: React.Dispatch<React.SetStateAction<ExerciseFormState>>;
  addExercise: () => void;
  error: string | null;
  loading: boolean
}

const ExerciseForm = ({
  exerciseForm,
  setExerciseForm,
  addExercise,
  error,
  loading
}: ExerciseFormProps) => {

  //Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setExerciseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExercise();
  };

  return (
    <div className='text-gray-200 bg-gray-700'>
      <h2>Exercise Form</h2>
      {error && <p>{error}</p>}
      <form
        className='flex flex-col'
        onSubmit={handleSubmit}
      >
        <label>Name</label>
        <input
          type='text'
          className='bg-white text-gray-900'
          name='name'
          value={exerciseForm.name}
          onChange={handleChange}
          required
        />
        <label>Description</label>
        <textarea
          className='bg-white text-gray-900'
          name='description'
          value={exerciseForm.description}
          onChange={handleChange}
        />
        <button type='submit' disabled={loading}> {loading ? 'Adding...' : 'Add'}</button>
      </form>
    </div>
  );
};

export default ExerciseForm;
