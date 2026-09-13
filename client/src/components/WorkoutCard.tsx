import type { Workout, WorkoutFormState } from '../types/workout';
import WorkoutForm from './WorkoutForm';

interface WorkoutCardProps {
  workout: Workout;
  onDelete: (id: string) => void;
  deleteError: string | null;
  deletingId: string | null;
  deleteErrorId: string | null;
  isEditing: boolean;
  editForm: WorkoutFormState;
  onStartEdit: (workout: Workout) => void;
  onCancelEdit: () => void;
  onEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onEditSubmit: (id: string) => void;
  updating: boolean;
  updateError: string | null;
  updateErrorId: string | null;
}

const WorkoutCard = ({
  workout,
  onDelete,
  deleteError,
  deletingId,
  deleteErrorId,
  isEditing,
  editForm,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onEditSubmit,
  updating,
  updateError,
  updateErrorId,
}: WorkoutCardProps) => {
  const isDeleting = deletingId === workout.id;

  if (isEditing) {
    return (
      <div className='max-w-xl mx-auto w-full bg-gray-800 rounded-xl shadow-md p-4 text-gray-100'>
        <WorkoutForm
          workoutForm={editForm}
          onChange={onEditChange}
          onSubmit={() => onEditSubmit(workout.id)}
          error={updateErrorId === workout.id ? updateError : null}
          loading={updating}
          submitLabel='Save'
          loadingLabel='Saving..'
        />
        <button
          onClick={onCancelEdit}
          disabled={updating}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-xl mx-auto w-full bg-gray-800 rounded-xl shadow-md p-4 text-gray-100'>
      <h3 className='text-lg font-semibold text-white'>{workout.name}</h3>
      <p className='text-sm text-gray-400 mt-1'>{workout.difficulty}</p>
      {deleteErrorId === workout.id && <p>{deleteError}</p>}
      <div className='flex gap-2 mt-2'>
        <button onClick={() => onStartEdit(workout)}>Edit</button>
        <button
          onClick={() => onDelete(workout.id)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;