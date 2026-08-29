import { useState } from 'react';

interface Exercise {
  id: string;
  name: string;
  description: string | null;
}

const Exercises = () => {
  const [exercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Push Up',
      description: 'Hello',
    },
    {
      id: '2',
      name: 'Plank',
      description: null,
    },
  ]);

  return (
    <div>
      <div className='space-y-3 mt-2'>
        {exercises.map((exercise) => (
          <div key={exercise.id} className='max-w-xl mx-auto w-full bg-gray-800 rounded-xl shadow-md p-4 text-gray-100'>
              <h3 className='text-lg font-semibold text-white'>{exercise.name}</h3>
              <p className='text-sm text-gray-400 mt-1'>{exercise.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;
