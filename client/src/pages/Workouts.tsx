import { useEffect, useState } from 'react';
import api from '../api/api';
import WorkoutForm from '../components/WorkoutForm';
import WorkoutCard from '../components/WorkoutCard';
import type { Workout, WorkoutFormState } from '../types/workout';

const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutForm, setWorkoutForm] = useState<WorkoutFormState>({
    name: '',
    difficulty: 'medium',
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Error states
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);

  // Update state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<WorkoutFormState>({
    name: '',
    difficulty: 'medium',
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateErrorId, setUpdateErrorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const { data } = await api.get('/workouts');
        setWorkouts(data.data);
      } catch (error) {
        console.error(error);
        setFetchError('Failed to load workouts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  // Handle input changes (create form)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setWorkoutForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create function
  const createWorkout = async () => {
    if (!workoutForm.name.trim()) {
      return;
    }

    try {
      setCreateError(null);
      setAdding(true);
      const { data } = await api.post('/workouts/create', workoutForm);

      const newWorkout: Workout = data.data;

      setWorkouts((prev) => [...prev, newWorkout]);

      setWorkoutForm({
        name: '',
        difficulty: 'medium',
      });
    } catch (error) {
      console.error('Failed to create', error);
      setCreateError('Failed to create, Try again');
    } finally {
      setAdding(false);
    }
  };

  // Delete function
  const deleteWorkout = async (id: string) => {
    try {
      setDeleteError(null);
      setDeletingId(id);
      setDeleteErrorId(null);
      await api.delete(`/workouts/${id}`);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error('Failed to delete', error);
      setDeleteErrorId(id);
      setDeleteError('Failed to delete. Try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Start editing a given workout — pre-fills the edit form
  const startEditing = (workout: Workout) => {
    setEditingId(workout.id);
    setEditForm({
      name: workout.name,
      difficulty: workout.difficulty,
    });
    setUpdateError(null);
    setUpdateErrorId(null);
  };

  // Cancel editing without saving
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', difficulty: 'medium' });
    setUpdateError(null);
    setUpdateErrorId(null);
  };

  // Handle input changes for the edit form
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update function
  const updateWorkout = async (id: string) => {
    if (!editForm.name.trim()) {
      return;
    }

    try {
      setUpdateError(null);
      setUpdateErrorId(null);
      setUpdatingId(id);

      const { data } = await api.patch(`/workouts/${id}`, editForm);
      const updatedWorkout: Workout = data.data;

      setWorkouts((prev) =>
        prev.map((w) => (w.id === id ? updatedWorkout : w)),
      );

      setEditingId(null);
      setEditForm({ name: '', difficulty: 'medium' });
    } catch (error) {
      console.error('Failed to update', error);
      setUpdateErrorId(id);
      setUpdateError('Failed to update. Try again.');
    } finally {
      setUpdatingId(null);
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
      <WorkoutForm
        onSubmit={createWorkout}
        onChange={handleChange}
        workoutForm={workoutForm}
        error={createError}
        loading={adding}
      />

      <div className='space-y-3 mt-2'>
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onDelete={deleteWorkout}
            deleteError={deleteError}
            deletingId={deletingId}
            deleteErrorId={deleteErrorId}
            isEditing={editingId === workout.id}
            editForm={editForm}
            onStartEdit={startEditing}
            onCancelEdit={cancelEditing}
            onEditChange={handleEditChange}
            onEditSubmit={updateWorkout}
            updating={updatingId === workout.id}
            updateError={updateError}
            updateErrorId={updateErrorId}
          />
        ))}
      </div>
    </div>
  );
};

export default Workouts;