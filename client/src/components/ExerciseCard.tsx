import type { Exercise } from '../types/exercise';

interface ExerciseProps {
  exercise: Exercise;
  onDelete: (id: string) => void;
  deleteError: string | null;
  deletingId: string | null;
  deleteErrorId: string | null;
}

const ExerciseCard = ({ exercise, onDelete, deleteError, deletingId, deleteErrorId }: ExerciseProps) => {

  const isDeleting = deletingId === exercise.id;

  return (
    <div className='max-w-xl mx-auto w-full bg-gray-800 rounded-xl shadow-md p-4 text-gray-100'>
      <h3 className='text-lg font-semibold text-white'>{exercise.name}</h3>
      <p className='text-sm text-gray-400 mt-1'>{exercise.description}</p>
      {deleteErrorId === exercise.id && <p>{deleteError}</p>}
      <button onClick={() => onDelete(exercise.id)} disabled={isDeleting}>{isDeleting? 'Deleting...' : 'Delete'}</button>
    </div>
  );
};

export default ExerciseCard;
