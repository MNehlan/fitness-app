import type { Exercise } from '../types/exercise';

interface ExerciseProps {
  exercise: Exercise;
}

const ExerciseCard = ({ exercise }: ExerciseProps) => {
  return (
    <div className='max-w-xl mx-auto w-full bg-gray-800 rounded-xl shadow-md p-4 text-gray-100'>
      <h3 className='text-lg font-semibold text-white'>{exercise.name}</h3>
      <p className='text-sm text-gray-400 mt-1'>{exercise.description}</p>
    </div>
  );
};

export default ExerciseCard;
