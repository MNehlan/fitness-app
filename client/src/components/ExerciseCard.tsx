import type { Exercise, ExerciseFormState } from '../types/exercise';
import ExerciseForm from './ExerciseForm';

interface ExerciseProps {
  exercise: Exercise;
  onDelete: (id: string) => void;
  deleteError: string | null;
  deletingId: string | null;
  deleteErrorId: string | null;
  isEditing: boolean;
  editForm: ExerciseFormState;
  onStartEdit: (exercise: Exercise) => void;
  onCancelEdit: () => void;
  onEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onEditSubmit: (id: string) => void;
  updating: boolean;
  updateError: string | null;
  updateErrorId: string | null;
}

const ExerciseCard = ({
  exercise,
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
}: ExerciseProps) => {
  const isDeleting = deletingId === exercise.id;

  if (isEditing) {
    return (
      <div className='max-w-xl mx-auto w-full bg-gray-800 rounded-xl shadow-md p-4 text-gray-100'>
        <ExerciseForm
          exerciseForm={editForm}
          onChange={onEditChange}
          onSubmit={() => onEditSubmit(exercise.id)}
          error={updateErrorId === exercise.id ? updateError : null}
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
      <h3 className='text-lg font-semibold text-white'>{exercise.name}</h3>
      <p className='text-sm text-gray-400 mt-1'>{exercise.description}</p>
      {deleteErrorId === exercise.id && <p>{deleteError}</p>}
      <div className='flex gap-2 mt-2'>
      <button onClick={() => onStartEdit(exercise)}>Edit</button>
        <button
          onClick={() => onDelete(exercise.id)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
