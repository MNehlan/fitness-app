import { useEffect, useState } from 'react';
import api from '../api/api';
import ExerciseForm from '../components/ExerciseForm';
import type { Exercise, ExerciseFormState } from '../types/exercise';
import ExerciseCard from '../components/ExerciseCard';

const Exercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseForm, setExerciseForm] = useState<ExerciseFormState>({
    name: '',
    description: '',
  });

  //Loading states
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  //Error states
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await api.get('/exercises');
        setExercises(data.data);
      } catch (error) {
        console.error(error);
        setFetchError('Failed to load exercises. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const addExercise = async () => {
    if (!exerciseForm.name.trim()) {
      return;
    }

    try {
      setCreateError(null);
      setAdding(true);
      const { data } = await api.post('/exercises/create', exerciseForm);

      const newExercise: Exercise = data.data;

      setExercises((prev) => [...prev, newExercise]);

      setExerciseForm({
        name: '',
        description: '',
      });
    } catch (error) {
      console.error('Failed to create', error);
      setCreateError('Failed to create, Try again');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return <div className='text-gray-400 p-4'>Loading...</div>;
  }

  if (fetchError) {
    return <div className='text-gray-400 p-4'>{fetchError}</div>;
  }

  return (
    <div>
      <ExerciseForm
        addExercise={addExercise}
        exerciseForm={exerciseForm}
        setExerciseForm={setExerciseForm}
        error={createError}
        loading={adding}
      />

      <div className='space-y-3 mt-2'>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
          />
        ))}
      </div>
    </div>
  );
};

export default Exercises;
