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

  //Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [ deleteErrorId, setDeleteErrorId ] = useState<string | null>(null);


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

  //Create function
  const createExercise = async () => {
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

  //Delete Function
  const deleteExercise = async (id: string) => {
    try {
      setDeleteError(null);
      setDeletingId(id);
      setDeleteErrorId(null);
      await api.delete(`/exercises/${id}`);
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    } catch (error) {
      console.error('Failed to delete', error);
      setDeleteErrorId(id);
      setDeleteError('Failed to delete. Try again.');
    } finally {
      setDeletingId(null);
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
        onSubmit={createExercise}
        onChange={handleChange}
        exerciseForm={exerciseForm}
        error={createError}
        loading={adding}
      />

      <div className='space-y-3 mt-2'>
        {exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onDelete={deleteExercise}
            deleteError={deleteError}
            deletingId={deletingId}
            deleteErrorId={deleteErrorId}
          />
        ))}
      </div>
    </div>
  );
};

export default Exercises;
