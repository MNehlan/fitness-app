import { useState } from 'react';
import type { Workout } from '../types/workout';

type WorkoutListProps = {
  workouts: Workout[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, newName: string) => void;
};

const WorkoutList = ({ workouts, onDelete, onUpdate }: WorkoutListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  function saveWorkout(id: string, newName: string) {
    onUpdate(id, newName);
    setEditingId(null);
    setNewName('');
  }

  function handleEdit(id: string, name: string) {
    setEditingId(id);
    setNewName(name);
  }

  return (
    <div className='border my-6'>
      <h1>WorkoutList</h1>
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className='border my-7'
        >
          {editingId === workout.id ? (
            <div>
              <input
                type='text'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={() => saveWorkout(workout.id, newName)}>
                Save
              </button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{workout.name}</p>
              <button onClick={() => handleEdit(workout.id, workout.name)}>
                Edit
              </button>
              <button onClick={() => onDelete(workout.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
